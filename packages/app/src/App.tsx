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
} from '@backstage/core';
import React, { FC } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Route, Routes, useRoutes } from 'react-router-dom';
import { EntityMetadataCard } from '@backstage/plugin-catalog/src/components/EntityMetadataCard/EntityMetadataCard';
import { Plugin as githubActions } from '@backstage/plugin-github-actions';
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
const AppRoutes = app.getRoutes();

// const BackstageRoute = ({ children, ...props }) => (
//   <Route {...props} element={children} />
// );

// const ImportedComponent = () => <Route path="/something" element={<div></div>hey something</div>}/>
const ParentContext = React.createContext<any>(null);

const RouteContext = React.createContext<any>(null);

const BackstageRoutesProvider = ({ children }) => {
  const [routes, setRoutes] = React.useState<any>([
    { path: '/', element: <div>dummy</div> },
  ]);
  const addRoute = route => setRoutes([...routes, route]);
  const addRouteToParent = (route, parent) => {
    console.log('Routes in BackstageRoutesProvider', { routes });
    const existingRoute = routes.find(r => r.path === parent);
    if (!existingRoute) {
      throw new Error(`No parent found: ${route.path}`);
    }
    existingRoute.children = [...(existingRoute.children || []), route];
  };
  return (
    <RouteContext.Provider value={{ routes, addRoute, addRouteToParent }}>
      <ParentContext.Provider>
        <BackstageRoutes>{children}</BackstageRoutes>
      </ParentContext.Provider>
    </RouteContext.Provider>
  );
};

const BackstageRoutes = ({ children }) => {
  const { routes: routesFromContext } = React.useContext(RouteContext);
  console.log({ routesFromContext });
  const currentRoute = useRoutes(routesFromContext);
  console.log({ currentRoute });

  return (
    <>
      {currentRoute}
      {children}
    </>
  );
};

const BackstageRoute = ({ path, children }) => {
  const parent = React.useContext(ParentContext);
  console.log({ parent });
  const { addRoute, addRouteToParent } = React.useContext(RouteContext);
  React.useEffect(() => {
    if (parent) {
      addRouteToParent({ path, element: children, parent });
    } else {
      addRoute({ path, element: children });
    }
  }, [parent]);
  return (
    <ParentContext.Provider value={path}>{children}</ParentContext.Provider>
  );
};
const App = () => {
  return (
    <AppProvider>
      <AppRouter>
        <BackstageRoutesProvider>
          <div>
            <BackstageRoute path="/github-actions/*">
              some stuff here
              <div>
                <div>
                  <BackstageRoute path="/something-else">
                    some other stuff here
                  </BackstageRoute>
                </div>
              </div>
            </BackstageRoute>
          </div>
        </BackstageRoutesProvider>
      </AppRouter>
    </AppProvider>
  );
};
// const App: FC<{}> = () => (
//   <AppProvider>
//     <AlertDisplay />
//     <OAuthRequestDialog />
//     <AppRouter>
//       <Root>
//         <Routes>
//           <Route
//             path="/github-actions"
//             element={<div>GithubActions</div>}
//           ></Route>
//         </Routes>
//         <Route
//           path="/catalog"
//           element={
//             <CatalogPage>
//               <EntityPage>
//                 {entity => (
//                   <>
//                     <Routes>
//                       <Route
//                         path="/overview"
//                         element={
//                           <OverviewLayout>
//                             <EntityMetadataCard entity={entity} />
//                           </OverviewLayout>
//                         }
//                       />

//                       <Route
//                         path="/ci-cd"
//                         element={
//                           <Switch>
//                             <GithubActions entity={entity} />
//                             <CircleCI entity={entity} />
//                           </Switch>
//                         }
//                       />
//                     </Routes>
//                     <Entity type="website">
//                       <Tabs>
//                         {entity.metadata && (
//                           <Tabs.Tab title="ci/cd" route={cicdrouteref} />
//                         )}
//                         {pluginDrivenPredicate(entity) && (
//                           <Tabs.Tab title="ci/cd" route={cicdrouteref} />
//                         )}
//                       </Tabs>
//                     </Entity>
//                   </>
//                 )}
//               </EntityPage>
//             </CatalogPage>
//           }
//         />
//       </Root>
//     </AppRouter>
//   </AppProvider>
// );

export default hot(App);
