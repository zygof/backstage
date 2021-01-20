# @backstage/plugin-app-backend

## 0.3.4

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.3.2

### Patch Changes

- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
- Updated dependencies [612368274]
  - @backstage/config-loader@0.4.0
  - @backstage/backend-common@0.3.3

## 0.3.1

### Patch Changes

- ff1301d28: Warn if the app-backend can't start-up because the static directory that should be served is unavailable.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2

## 0.3.0

### Minor Changes

- 1722cb53c: Use new config schema support to automatically inject config with frontend visibility, in addition to the existing env schema injection.

  This removes the confusing behavior where configuration was only injected into the app at build time. Any runtime configuration (except for environment config) in the backend used to only apply to the backend itself, and not be injected into the frontend.

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0
  - @backstage/config-loader@0.3.0

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [ce5512bc0]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
  - @backstage/config-loader@0.2.0
