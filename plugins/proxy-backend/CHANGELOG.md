# @backstage/plugin-proxy-backend

## 0.2.4

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.2.2

### Patch Changes

- 6a6c7c14e: Filter the headers that are sent from the proxied-targed back to the frontend to not forwarded unwanted authentication or
  monitoring contexts from other origins (like `Set-Cookie` with e.g. a google analytics context). The implementation reuses
  the `allowedHeaders` configuration that now controls both directions `frontend->target` and `target->frontend`.
- 3619ea4c4: Add configuration schema for the commonly used properties
- Updated dependencies [612368274]
  - @backstage/backend-common@0.3.3

## 0.2.1

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 9226c2aaa: Limit the http headers that are forwarded from the request to a safe set of defaults.
  A user can configure additional headers that should be forwarded if the specific applications needs that.

  ```yaml
  proxy:
    '/my-api':
      target: 'https://my-api.com/get'
      allowedHeaders:
        # We need to forward the Authorization header that was provided by the caller
        - Authorization
  ```

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
