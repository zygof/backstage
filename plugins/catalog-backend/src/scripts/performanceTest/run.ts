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
import { loadConfig } from '@backstage/config-loader';
import { buildCatalog } from './lib/buildCatalog';
import { buildTestList } from './lib/buildTestList';

async function main(args: string[]) {
  const tests = await buildTestList();

  if (args.length !== 1) {
    console.error('Expected a single argument: the name of a test to run');
    console.error('The following tests are available:');
    tests.forEach(test => {
      console.log(`  - ${test.label}`);
    });
    process.exit(1);
  }

  const test = tests.find(test => test.label === args[0]);
  if (!test) {
    console.error(`There is no test named ${args[0]}`);
    console.error('The following tests are available:');
    tests.forEach(test => {
      console.log(`  - ${test.label}`);
    });
    process.exit(1);
  }

  const config = ConfigReader.fromConfigs(
    await loadConfig({
      // eslint-disable-next-line no-restricted-syntax
      configRoot: __dirname,
      configPaths: [test.path],
      env: 'development',
    }),
  );

  console.log('B');

  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
  } = await buildCatalog(config);

  console.log('C');

  await higherOrderOperation.addLocation({
    type: 'url',
    target: 'http://ignored.com',
  });

  console.log('D');
}

main(process.argv.slice(2))
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  console.log('CTRL+C pressed; exiting.');
  process.exit(0);
});
