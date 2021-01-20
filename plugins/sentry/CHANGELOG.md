# @backstage/plugin-sentry

## 0.3.3

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.2

### Patch Changes

- 88da267cc: Port to new composability API by exporting new `EntitySentryContent` and `EntitySentryCard` component extensions.
- Updated dependencies [9c09a364f]
  - @backstage/plugin-catalog@0.2.10

## 0.3.1

### Patch Changes

- 962d1ad66: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1

## 0.3.0

### Minor Changes

- 075d3dc5a: The plugin uses the `proxy-backend` instead of a custom `sentry-backend`.
  It requires a proxy configuration:

  `app-config.yaml`:

  ```yaml
  proxy:
    '/sentry/api':
      target: https://sentry.io/api/
      allowedMethods: ['GET']
      headers:
        Authorization:
          $env: SENTRY_TOKEN # export SENTRY_TOKEN="Bearer <your-sentry-token>"
  ```

  The `MockApiBackend` is no longer configured by the `NODE_ENV` variable.
  Instead, the mock backend can be used with an api-override:

  `packages/app/src/apis.ts`:

  ```ts
  import { createApiFactory } from '@backstage/core';
  import { MockSentryApi, sentryApiRef } from '@backstage/plugin-sentry';

  export const apis = [
    // ...

    createApiFactory(sentryApiRef, new MockSentryApi()),
  ];
  ```

  If you already use the Sentry backend, you must remove it from the backend:

  Delete `packages/backend/src/plugins/sentry.ts`.

  ```diff
  # packages/backend/package.json

  ...
      "@backstage/plugin-scaffolder-backend": "^0.3.2",
  -   "@backstage/plugin-sentry-backend": "^0.1.3",
      "@backstage/plugin-techdocs-backend": "^0.3.0",
  ...
  ```

  ```diff
  // packages/backend/src/index.html

    const apiRouter = Router();
    apiRouter.use('/catalog', await catalog(catalogEnv));
    apiRouter.use('/rollbar', await rollbar(rollbarEnv));
    apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  - apiRouter.use('/sentry', await sentry(sentryEnv));
    apiRouter.use('/auth', await auth(authEnv));
    apiRouter.use('/techdocs', await techdocs(techdocsEnv));
    apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
    apiRouter.use('/proxy', await proxy(proxyEnv));
    apiRouter.use('/graphql', await graphql(graphqlEnv));
    apiRouter.use(notFoundHandler());
  ```

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.2.4

### Patch Changes

- 303c5ea17: Refactor route registration to remove deprecating code
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/catalog-model@0.4.0

## 0.2.3

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0

## 0.2.2

### Patch Changes

- 1722cb53c: Added configuration schema
- Updated dependencies [1722cb53c]
  - @backstage/core@0.3.1

## 0.2.1

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
