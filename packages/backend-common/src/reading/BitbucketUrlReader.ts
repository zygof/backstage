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

import {
  BitbucketIntegrationConfig,
  readBitbucketIntegrationConfigs,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import parseGitUri from 'git-url-parse';
import { Readable } from 'stream';
import { InputError, NotFoundError } from '../errors';
import { ReadTreeResponseFactory } from './tree';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  UrlReader,
} from './types';

export function getApiRequestOptions(
  provider: BitbucketIntegrationConfig,
): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers.Authorization = `Bearer ${provider.token}`;
  } else if (provider.username && provider.appPassword) {
    headers.Authorization = `Basic ${Buffer.from(
      `${provider.username}:${provider.appPassword}`,
      'utf8',
    ).toString('base64')}`;
  }

  return {
    headers,
  };
}

// Converts for example
// from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
// to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
export function getApiUrl(
  target: string,
  provider: BitbucketIntegrationConfig,
): URL {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUri(target);
    if (
      !owner ||
      !name ||
      (filepathtype !== 'browse' &&
        filepathtype !== 'raw' &&
        filepathtype !== 'src')
    ) {
      throw new Error('Invalid Bitbucket URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');

    if (provider.host === 'bitbucket.org') {
      if (!ref) {
        throw new Error('Invalid Bitbucket URL or file path');
      }
      return new URL(
        `${provider.apiBaseUrl}/repositories/${owner}/${name}/src/${ref}/${pathWithoutSlash}`,
      );
    }
    return new URL(
      `${provider.apiBaseUrl}/projects/${owner}/repos/${name}/raw/${pathWithoutSlash}?at=${ref}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

/**
 * A processor that adds the ability to read files from Bitbucket v1 and v2 APIs, such as
 * the one exposed by Bitbucket Cloud itself.
 */
export class BitbucketUrlReader implements UrlReader {
  private readonly config: BitbucketIntegrationConfig;
  private readonly treeResponseFactory: ReadTreeResponseFactory;

  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );
    return configs.map(provider => {
      const reader = new BitbucketUrlReader(provider, { treeResponseFactory });
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(
    config: BitbucketIntegrationConfig,
    deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    const { host, apiBaseUrl, token, username, appPassword } = config;

    if (!apiBaseUrl) {
      throw new Error(
        `Bitbucket integration for '${host}' must configure an explicit apiBaseUrl`,
      );
    }

    if (!token && username && !appPassword) {
      throw new Error(
        `Bitbucket integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }

    this.config = config;
    this.treeResponseFactory = deps.treeResponseFactory;
  }

  async read(url: string): Promise<Buffer> {
    const bitbucketUrl = getApiUrl(url, this.config);

    const options = getApiRequestOptions(this.config);

    let response: Response;
    try {
      response = await fetch(bitbucketUrl.toString(), options);
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${bitbucketUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const {
      name: repoName,
      owner,
      ref,
      protocol,
      resource,
      // filepath,
    } = parseGitUri(url);

    const isHosted = resource === 'bitbucket.org';

    if (isHosted && !ref) {
      // TODO(freben): We should add support for defaulting to the default branch
      throw new InputError(
        'Bitbucket URL must contain branch to be able to fetch tree',
      );
    }

    const archiveUrl = isHosted
      ? `${protocol}://${resource}/${owner}/${repoName}/get/${ref}.zip`
      : `${protocol}://${resource}/projects/${owner}/repos/${repoName}/archive?format=zip`;

    const response = await fetch(archiveUrl, getApiRequestOptions(this.config));
    if (!response.ok) {
      const message = `Failed to read tree from ${url}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return this.treeResponseFactory.fromZipArchive({
      stream: (response.body as unknown) as Readable,
      // TODO: The zip contains the commit hash, not branch name - may need additional api call to get it
      // path: `${owner}-${repoName}-4f9778cd49a4/${filepath}`,
      filter: options?.filter,
    });
  }

  toString() {
    const { host, token, username, appPassword } = this.config;
    let authed = Boolean(token);
    if (!authed) {
      authed = Boolean(username && appPassword);
    }
    return `bitbucket{host=${host},authed=${authed}}`;
  }
}
