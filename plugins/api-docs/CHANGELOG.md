# @backstage/plugin-api-docs

## 0.4.3

### Patch Changes

- 8855f61f6: Update `@asyncapi/react-component` to 0.18.2
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

## 0.4.2

### Patch Changes

- 9161531b2: Link register API to catalog-import plugin
- Updated dependencies [a08c32ced]
- Updated dependencies [7e0b8cac5]
- Updated dependencies [87c0c53c2]
  - @backstage/core@0.4.3
  - @backstage/plugin-catalog@0.2.9

## 0.4.1

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.4.0

### Minor Changes

- 246799c7f: Stop exposing a custom router from the `api-docs` plugin. Instead, use the
  widgets exported by the plugin to compose your custom entity pages.

  Instead of displaying the API definitions directly in the API tab of the
  component, it now contains tables linking to the API entities. This also adds
  new widgets to display relationships (bot provides & consumes relationships)
  between components and APIs.

  See the changelog of `create-app` for a migration guide.

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.1

### Patch Changes

- 7eb8bfe4a: Update swagger-ui-react to 3.37.2
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.3.0

### Minor Changes

- f3bb55ee3: APIs now have real entity pages that are customizable in the app.
  Therefore the old entity page from this plugin is removed.
  See the `packages/app` on how to create and customize the API entity page.

### Patch Changes

- 6f70ed7a9: Replace usage of implementsApis with relations
- Updated dependencies [6f70ed7a9]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
  - @backstage/plugin-catalog@0.2.4
  - @backstage/catalog-model@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.2.1

### Patch Changes

- 0c0798f08: Persist table state of the API Explorer to the browser history. This allows to navigate between pages and come back to the previous filter state.
- 84b654d5d: Use dense table style and outlined chips in the API Explorer.
- 803527bd3: Upgrade @kyma-project/asyncapi-react to 0.14.2
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 339668995: There were some missing features and markdown was not rendered properly, but this is fixed now.

  Details:

  - [`asyncapi/asyncapi-react#149`](https://github.com/asyncapi/asyncapi-react/pull/149) - fix: improve markdown rendering of nested fields
  - [`asyncapi/asyncapi-react#150`](https://github.com/asyncapi/asyncapi-react/pull/150) - feat: display the description of channels and operations
  - [`asyncapi/asyncapi-react#153`](https://github.com/asyncapi/asyncapi-react/pull/153) - fix: let the list of `enums` break into multiple lines

### Patch Changes

- a73979d45: Resolve some dark mode styling issues in asyncAPI specs
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
