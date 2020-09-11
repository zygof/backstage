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
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  createRouteRef,
} from '@backstage/core';
import React, { FC } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as GraphiQLRouter } from '@backstage/plugin-graphiql';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
import { Router as LighthouseRouter, lighthouseApiRef } from '@backstage/plugin-lighthouse';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Route, Routes, Navigate } from 'react-router';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});
<a href="localhost:3000/catalog/some-hacky-thing?subroute=builds/235246" />

const AppRoutes = () => (
  <BackstageRoutes>
    <Navigate key="/" to="/catalog" />
    <Route
      path={`${catalogRouteRef.path}/*`}
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/docs/*" element={<DocsRouter />} />
    <Route
      path="/tech-radar"
      element={<TechRadarRouter width={1500} height={800} />}
    />
    <Route path="/graphiql" element={<GraphiQLRouter />} />
    <Route path="/lighthouse/*" element={<LighthouseRouter />} />
    <RefRoute path="/lighthouse/*" routeRef={lighthouseRootRouteRef} />
    {/*
    createPlugin({
      exportedRoutes: {
        'root': '/lighthouse'
        'cicd': (entity) => `...`,
      }
    })

    mount('lighthouse', )
    `${get('lighthouse')/${lighthouseExportedFnForSubroute(entity)}}`
    <RoutesContext overrides={{ 'lighthouse': '/cece' }}>

    // in pluginB
    import { pluginA } from '@internal/pluginA';
    export PluginB = () => {
      const path = useResolvedRoute(pluginA, p => p.routes.cicd(entity));
      // ^ i dunno :) just want discoverable, simple, routes where pluginA
      // only knows how to construct its own internal route segments, just
      // like it defines its own relative shape
    }
    */}
    <Route path="/web-audits" element={<LighthouseRouter />} />
    <Route
      path="/register-component"
      element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
    />
    {...deprecatedAppRoutes}
  </Routes>
);

// lighthouseApiRef.link() == /lighthouse
// lighthouseApiRef.link() == /web-audits
// lighthouseApiRef.link() == /?route-ref=/lighthouse
<a href={lighthouseApiRef.link()}></a>

const useRouterRefOverride = (routeRef) => {
  const path = useRoutePath()
  routeRef.override({path})
}

// pragma
// React.createElement

const LighthouseRouter = () => {
  useRouterRefOverride(lighthouseApiRef)
}

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
