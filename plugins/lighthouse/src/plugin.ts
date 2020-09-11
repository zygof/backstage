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

import {
  createPlugin,
  createRouteRef,
  createApiFactory,
  configApiRef,
} from '@backstage/core';
import { lighthouseApiRef, LighthouseRestApi } from './api';

// NOW

export const rootRouteRef = createRouteRef({
  path: '',
  title: 'Lighthouse',
});

export const viewAuditRouteRef = createRouteRef({
  path: 'audit/:id',
  title: 'View Lighthouse Audit',
});

export const createAuditRouteRef = createRouteRef({
  path: 'create-audit',
  title: 'Create Lighthouse Audit',
});

// ORIGINAL

export const rootRouteRefOrig = createRouteRef({
  path: '/lighthouse',
  title: 'Lighthouse',
});

export const viewAuditRouteRefOrig = createRouteRef({
  path: '/lighthouse/audit/:id',
  title: 'View Lighthouse Audit',
});

export const createAuditRouteRefOrig = createRouteRef({
  path: '/lighthouse/create-audit',
  title: 'Create Lighthouse Audit',
});

// DESIRED

export const rootRouteRefWant = createRouteRef({
  path: '/lighthouse',
  title: 'Lighthouse',
});
rootRouteRefWant.link()

rootRouteRefWant.override({
  path: '/website-audits'
})

// Subroutes are immutable
export const viewAuditRouteRefWant = rootRouteRefWant.createSubRoute<{/** some desc */ id: number}>({
  path: 'audit/:id',
});
viewAuditRouteRefWant.link({id: ':id'})

<RefRoute routeRef={viewAuditRouteRefWant}/>


resolvePath()

export const createAuditRouteRefWant = rootRouteRefWant.createSubRoute({
  path: 'create-audit',
});

// CATALOG

export const catalogRootRouteRef = createRouteRef({
  path: '/catalog',
});

export const entityRouteRef = catalogRootRouteRef.createSubRoute({
  path: ':entity'
})

// other plugin

export const gitActionsRouteRef = entityRouteRef.createSubRoute({
  path: 'github-actions'
})

export const gitActionsRouteRef = createRouteRef({
  relativeTo: entityRouteRef,
  path: '/github-actions',
});



// Nav targets can have default icon and titles to display when linking to them
export const deploymentsListNav = createNavTarget({
  path: '/deployments',
  icon: DeplyomentsIcon,
  title: 'Deployments',
})

// Params are added as type parameters to the target
export const deploymentNav = createNavTarget<string>({
  relativeTo: deploymentsListNav, // Relative to other nav targets? ¯\_(ツ)_/¯
  path: '/:name',
  icon: DeplyomentsIcon,
  // Titles can be generated based on params
  title: ({ params: [name] }) => `Deployment - ${name}`,
})

export const plugin = createPlugin({
  id: 'lighthouse',
  apis: [
    createApiFactory({
      api: lighthouseApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => LighthouseRestApi.fromConfig(configApi),
    }),
  ],
});



/*

1. Work on the RouteRefs API improvement
1.1 .createSubRoute
1.2 Typed params (with named params first)
1.3
2. Create RefRoute component that accepts a routeRef

Considerations:
  Analytics - get the raw route in analytics event, with named parameters?
  Dynamic loading - What needs to be available at boot, what can be deferred to dynamic loads?

*/
