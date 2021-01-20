# @backstage/dev-utils

## 0.1.8

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

## 0.1.7

### Patch Changes

- 696b8ce74: Add new `addPage` method for use with extensions, as well as an `EntityGridItem` to easily create different test cases for entity overview cards.
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [87c0c53c2]
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9

## 0.1.6

### Patch Changes

- b6557c098: Update ApiFactory type to correctly infer API type and disallow mismatched implementations.

  This fixes for example the following code:

  ```ts
  interface MyApi {
    myMethod(): void
  }

  const myApiRef = createApiRef<MyApi>({...});

  createApiFactory({
    api: myApiRef,
    deps: {},
    // This should've caused an error, since the empty object does not fully implement MyApi
    factory: () => ({}),
  })
  ```

- e1f4e24ef: Fix @backstage/cli not being a devDependency
- Updated dependencies [2527628e1]
- Updated dependencies [e1f4e24ef]
- Updated dependencies [1c69d4716]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/test-utils@0.1.5
  - @backstage/theme@0.2.2

## 0.1.5

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [4a655c89d]
- Updated dependencies [8a16e8af8]
- Updated dependencies [00670a96e]
  - @backstage/cli@0.4.0
  - @backstage/test-utils@0.1.4

## 0.1.4

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [902340451]
  - @backstage/cli@0.3.0
  - @backstage/core@0.3.1
  - @backstage/test-utils@0.1.3

## 0.1.3

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

## 0.1.2

### Patch Changes

- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [3472c8be7]
- Updated dependencies [1d0aec70f]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a3840bed2]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [72f6cda35]
- Updated dependencies [8c2b76e45]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [cba4e4d97]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [8afce088a]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [9a3b3dbf1]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
- Updated dependencies [7bbeb049f]
  - @backstage/cli@0.2.0
  - @backstage/core@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
