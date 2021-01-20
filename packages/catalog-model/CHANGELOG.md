# @backstage/catalog-model

## 0.7.0

### Minor Changes

- a93f42213: The catalog no longer attempts to merge old and new annotations, when updating an entity from a remote location. This was a behavior that was copied from kubernetes, and catered to use cases where you wanted to use HTTP POST to update an entity in-place, outside of what the refresh loop does. This has proved to be a mistake, because as a side effect, the refresh loop effectively is unable to ever delete annotations when they are removed from source YAML. This is obviously a breaking change, but we believe that this is not a behavior that is relied upon in the wild, and it has never been an actually supported use flow of the catalog. We therefore choose to break the behavior outright, and instead just store updated annotations verbatim - just like we already do for example for labels

### Patch Changes

- def2307f3: Adds a `backstage.io/managed-by-origin-location` annotation to all entities. It links to the
  location that was registered to the catalog and which emitted this entity. It has a different
  semantic than the existing `backstage.io/managed-by-location` annotation, which tells the direct
  parent location that created this entity.

  Consider this example: The Backstage operator adds a location of type `github-org` in the
  `app-config.yaml`. This setting will be added to a `bootstrap:boostrap` location. The processor
  discovers the entities in the following branch
  `Location bootstrap:bootstrap -> Location github-org:… -> User xyz`. The user `xyz` will be:

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: User
  metadata:
    name: xyz
    annotations:
      # This entity was added by the 'github-org:…' location
      backstage.io/managed-by-location: github-org:…
      # The entity was added because the 'bootstrap:boostrap' was added to the catalog
      backstage.io/managed-by-origin-location: bootstrap:bootstrap
      # ...
  spec:
    # ...
  ```

## 0.6.1

### Patch Changes

- f3b064e1c: Export the `schemaValidator` helper function.
- abbee6fff: Implement System, Domain and Resource entity kinds.
- 147fadcb9: Add subcomponentOf to Component kind to represent subsystems of larger components.

## 0.6.0

### Minor Changes

- ac3560b42: Remove `implementsApis` from `Component` entities. Deprecation happened in [#3449](https://github.com/backstage/backstage/pull/3449).
  Use `providesApis` instead.

### Patch Changes

- c911061b7: Introduce a `profile` section for group entities that can optional include a
  `displayName`, `email` and `picture`.
- 0e6298f7e: Ignore relations when comparing entities. This stops the refresh loop from rewriting entities over and over.

## 0.5.0

### Minor Changes

- 83b6e0c1f: Remove the deprecated fields `ancestors` and `descendants` from the `Group` entity.

  See https://github.com/backstage/backstage/issues/3049 and the PRs linked from it for details.

### Patch Changes

- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2

## 0.4.0

### Minor Changes

- bcc211a08: k8s-plugin: refactor approach to use annotation based label-selector

### Patch Changes

- 08835a61d: Add support for relative targets and implicit types in Location entities.
- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

## 0.3.1

### Patch Changes

- ab94c9542: Add `providesApis` and `consumesApis` to the component entity spec.
- 2daf18e80: Start emitting all known relation types from the core entity kinds, based on their spec data.
- 069cda35f: Marked the field `spec.implementsApis` on `Component` entities for deprecation on Dec 14th, 2020.

  Code that consumes these fields should remove those usages as soon as possible and migrate to using
  relations instead. Producers should fill the field `spec.providesApis` instead, which has the same
  semantic.

  After Dec 14th, the fields will be removed from types and classes of the Backstage repository. At
  the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain this field after the deletion, they will still be
  valid and your ingestion will not break, but they won't be visible in the types for consuming code, and the expected relations will not be generated based on them either.

## 0.3.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

## 0.2.0

### Minor Changes

- 3a4236570: Add handling and docs for entity references
- e0be86b6f: Entirely case insensitive read path of entities
- f70a52868: Add the User & Group entities

  A user describes a person, such as an employee, a contractor, or similar. Users belong to Group entities in the catalog.

  A group describes an organizational entity, such as for example a team, a business unit, or a loose collection of people in an interest group. Members of these groups are modeled in the catalog as kind User.

- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.
- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- b3d57961c: Enable adding locations for config files that does not yet exist by adding a flag to api request

### Patch Changes

- fa56f4615: Fix documentation and validation message for tags
