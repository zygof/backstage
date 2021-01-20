# @backstage/plugin-auth-backend

## 0.2.11

### Patch Changes

- 0643a3336: Add AWS ALB OIDC reverse proxy authentication provider
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/catalog-client@0.3.5

## 0.2.10

### Patch Changes

- 468579734: Allow blank certificates and support logout URLs in the SAML provider.
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.2.9

### Patch Changes

- 0289a059c: Add support for the majority of the Core configurations for Passport-SAML.

  These configuration keys are supported:

  - entryPoint
  - issuer
  - cert
  - privateKey
  - decryptionPvk
  - signatureAlgorithm
  - digestAlgorithm

  As part of this change, there is also a fix to the redirection behaviour when doing load balancing and HTTPS termination - the application's baseUrl is used to generate the callback URL. For properly configured Backstage installations, no changes are necessary, and the baseUrl is respected.

- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.2.8

### Patch Changes

- cc046682e: fix bug in token expiration date

## 0.2.7

### Patch Changes

- 7b15cc271: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1
  - @backstage/catalog-client@0.3.4

## 0.2.6

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0
  - @backstage/catalog-client@0.3.3

## 0.2.5

### Patch Changes

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0
  - @backstage/catalog-client@0.3.2

## 0.2.4

### Patch Changes

- 50eff1d00: Allow the backend to register custom AuthProviderFactories
- 700a212b4: bug fix: issue 3223 - detect mismatching origin and indicate it in the message at auth failure
- Updated dependencies [3aa7efb3f]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2
  - @backstage/catalog-model@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1
  - @backstage/catalog-client@0.3.1

## 0.2.2

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
- Updated dependencies [717e43de1]
  - @backstage/backend-common@0.3.0
  - @backstage/catalog-client@0.3.0

## 0.2.1

### Patch Changes

- 752808090: Handle non-7-bit safe characters in the posted message data
- 462876399: Encode the OAuth state parameter using URL safe chars only, so that providers have an easier time forming the callback URL.
- Updated dependencies [33b7300eb]
  - @backstage/backend-common@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 6f1768c0f: Initial implementation of catalog user lookup

  This adds a basic catalog client + method for the Google provider to look up users in the catalog. It expects to find a single user entity in the catalog with a google.com/email annotation that matches the email of the Google profile.

  Right now it falls back to the old behavior of splitting the email, since I don't wanna break the sign-in flow for existing apps, not yet anyway x).

  - Added "@backstage/catalog-model@^0.1.1-alpha.23" as a dependency
  - Added "node-fetch@^2.6.1" as a dependency

- 1687b8fbb: Lookup user in Google Auth Provider

### Patch Changes

- b4e5466e1: Move auth provider router creation to router
- b652bf2cc: Add OneLogin Identity Provider to Auth Backend
- e142a2767: Better presentation of authentication errors
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
