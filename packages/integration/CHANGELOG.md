# @backstage/integration

## 0.2.1

### Patch Changes

- 0b135e7e0: Add support for GitHub Apps authentication for backend plugins.

  `GithubCredentialsProvider` requests and caches GitHub credentials based on a repository or organization url.

  The `GithubCredentialsProvider` class should be considered stateful since tokens will be cached internally.
  Consecutive calls to get credentials will return the same token, tokens older than 50 minutes will be considered expired and reissued.
  `GithubCredentialsProvider` will default to the configured access token if no GitHub Apps are configured.

  More information on how to create and configure a GitHub App to use with backstage can be found in the documentation.

  Usage:

  ```javascript
  const credentialsProvider = new GithubCredentialsProvider(config);
  const { token, headers } = await credentialsProvider.getCredentials({
    url: 'https://github.com/',
  });
  ```

  Updates `GithubUrlReader` to use the `GithubCredentialsProvider`.

- fa8ba330a: Fix GitLab API base URL and add it by default to the gitlab.com host

## 0.2.0

### Minor Changes

- 466354aaa: Build out the `ScmIntegrations` class, as well as the individual `*Integration` classes

## 0.1.5

### Patch Changes

- 036a84373: Provide support for on-prem azure devops

## 0.1.4

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- 178e09323: Validate that integration config contains a valid host

## 0.1.3

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- b8ecf6f48: Add the basics of cross-integration concerns
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2

## 0.1.2

### Patch Changes

- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration

## 0.1.1

### Patch Changes

- 7b37e6834: Added the integration package
