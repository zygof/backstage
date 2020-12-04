/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigReader } from '@backstage/config';
import { BitbucketIntegrationConfig } from '@backstage/integration';
import { msw } from '@backstage/test-utils';
import fs from 'fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import {
  BitbucketUrlReader,
  getApiRequestOptions,
  getApiUrl,
} from './BitbucketUrlReader';
import { ReadTreeResponseFactory } from './tree';

const treeResponseFactory = ReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('BitbucketUrlReader', () => {
  describe('getApiRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getApiRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('Bearer A');
      expect(
        (getApiRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });

    it('insert basic auth when needed', () => {
      const withUsernameAndPassword: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        username: 'some-user',
        appPassword: 'my-secret',
      };
      const withoutUsernameAndPassword: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getApiRequestOptions(withUsernameAndPassword).headers as any)
          .Authorization,
      ).toEqual('Basic c29tZS11c2VyOm15LXNlY3JldA==');
      expect(
        (getApiRequestOptions(withoutUsernameAndPassword).headers as any)
          .Authorization,
      ).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: BitbucketIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });
    it('happy path for Bitbucket Cloud', () => {
      const config: BitbucketIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      expect(
        getApiUrl(
          'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.bitbucket.org/2.0/repositories/org-name/repo-name/src/master/templates/my-template.yaml',
        ),
      );
    });
    it('happy path for Bitbucket Server', () => {
      const config: BitbucketIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://bitbucket.mycompany.net/rest/api/1.0',
      };
      expect(
        getApiUrl(
          'https://bitbucket.mycompany.net/projects/a/repos/b/browse/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://bitbucket.mycompany.net/rest/api/1.0/projects/a/repos/b/raw/path/to/c.yaml',
        ),
      );
    });
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      const processor = new BitbucketUrlReader(
        { host: 'bitbucket.org', apiBaseUrl: 'https://api.bitbucket.org/2.0' },
        { treeResponseFactory },
      );
      await expect(
        processor.read('https://not.bitbucket.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.bitbucket.com/apa, Error: Invalid Bitbucket URL or file path',
      );
    });
  });

  describe('readTree', () => {
    const worker = setupServer();
    msw.setupDefaultHandlers(worker);

    const repoBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'repo.zip'),
    );

    it('returns the wanted files from an archive', async () => {
      worker.use(
        rest.get(
          'https://bitbucket.org/backstage/mock/get/master.zip',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
      );

      const processor = new BitbucketUrlReader(
        { host: 'bitbucket.org', apiBaseUrl: 'x' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://bitbucket.org/backstage/mock/src/master',
      );

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('uses private bitbucket host', async () => {
      worker.use(
        rest.get(
          'https://bitbucket.mycompany.net/projects/a/repos/b/archive?format=tgz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
      );

      const processor = new BitbucketUrlReader(
        { host: 'bitbucket.mycompany.net', apiBaseUrl: 'x' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://bitbucket.mycompany.net/projects/a/repos/b/browse/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('must specify a branch', async () => {
      const processor = new BitbucketUrlReader(
        { host: 'bitbucket.org', apiBaseUrl: 'x' },
        { treeResponseFactory },
      );

      await expect(
        processor.readTree('https://bitbucket.org/backstage/mock'),
      ).rejects.toThrow(
        'Bitbucket URL must contain branch to be able to fetch tree',
      );
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      worker.use(
        rest.get(
          'https://bitbucket.org/backstage/mock/get/master.zip',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.body(repoBuffer),
            ),
        ),
      );

      const processor = new BitbucketUrlReader(
        { host: 'bitbucket.org', apiBaseUrl: 'x' },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://bitbucket.org/backstage/mock/src/master/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });
});
