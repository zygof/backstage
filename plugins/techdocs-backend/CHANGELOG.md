# @backstage/plugin-techdocs-backend

## 0.5.4

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [53c9c51f2]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/techdocs-common@0.3.5

## 0.5.3

### Patch Changes

- 68ad5af51: Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
  an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
  is no breaking change for you.
  But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
- cb7af51e7: If using Url Reader, cache downloaded source files for 30 minutes.
- Updated dependencies [68ad5af51]
- Updated dependencies [f3b064e1c]
- Updated dependencies [371f67ecd]
- Updated dependencies [f1e74777a]
- Updated dependencies [dbe4450c3]
- Updated dependencies [5826d0973]
- Updated dependencies [b3b9445df]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/techdocs-common@0.3.3
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.5.2

### Patch Changes

- 7ec525481: 1. Added option to use AWS S3 as a choice to store the static generated files for TechDocs.
- Updated dependencies [7ec525481]
- Updated dependencies [5ecd50f8a]
- Updated dependencies [f8ba88ded]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/techdocs-common@0.3.2
  - @backstage/backend-common@0.4.2

## 0.5.1

### Patch Changes

- 8804e8981: Using @backstage/integration package for GitHub/GitLab/Azure tokens and request options.

  Most probably you do not have to make any changes in the app because of this change.
  However, if you are using the `DirectoryPreparer` or `CommonGitPreparer` exported by
  `@backstage/techdocs-common` package, you now need to add pass in a `config` (from `@backstage/config`)
  instance as argument.

  ```
  <!-- Before -->
      const directoryPreparer = new DirectoryPreparer(logger);
      const commonGitPreparer = new CommonGitPreparer(logger);
  <!-- Now -->
      const directoryPreparer = new DirectoryPreparer(config, logger);
      const commonGitPreparer = new CommonGitPreparer(config, logger);
  ```

- 359f9d2d8: Added configuration schema for the commonly used properties of techdocs and techdocs-backend plugins
- Updated dependencies [8804e8981]
  - @backstage/techdocs-common@0.3.1

## 0.5.0

### Minor Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

### Patch Changes

- Updated dependencies [a8573e53b]
  - @backstage/techdocs-common@0.3.0

## 0.4.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/techdocs-common@0.2.0
  - @backstage/backend-common@0.4.1

## 0.3.2

### Patch Changes

- 1e22f8e0b: Unify `dockerode` library and type dependency versions
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.1

### Patch Changes

- ae95c7ff3: Update URL auth format for GitLab clone
- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.0

### Minor Changes

- 4b53294a6: - Use techdocs annotation to add repo_url if missing in mkdocs.yml. Having repo_url creates a Edit button on techdocs pages.
  - techdocs-backend: API endpoint `/metadata/mkdocs/*` renamed to `/metadata/techdocs/*`

### Patch Changes

- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

### Patch Changes

- 22ff8fba5: Replacing the hard coded `baseApiUrl` by reading the value from configuration to enable private GitHub setup for TechDocs.
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
