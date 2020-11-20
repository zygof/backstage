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

import { Link } from '@material-ui/core';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
  ReactElement,
  ComponentType,
  ReactComponentElement,
  useLayoutEffect,
} from 'react';
import {
  Route,
  Routes,
  createRoutesFromChildren,
  useRoutes,
  useMatch,
  useParams,
  Outlet,
} from 'react-router';

class RouteRef {
  constructor(private readonly config: { id: string }) {}

  toString() {
    return `routeRef${JSON.stringify(this.config)}`;
  }
}

class ConsumedRouteRef {
  constructor(private readonly config: { id: string }) {}

  toString() {
    return `routeRef${JSON.stringify(this.config)}`;
  }
}

type Plugin = {
  id: string;
  producesRoutes: { [name: string]: RouteRef };
  consumesRoutes: { [name: string]: ConsumedRouteRef };
};

function createPlugin(spec: Plugin): Plugin {
  const { id, producesRoutes = {}, consumesRoutes = {} } = spec;
  return {
    id,
    producesRoutes,
    consumesRoutes,
  };
}

const buildListRouteRef = new RouteRef({ id: 'tingle.build-list' });
const consumedEntityRouteRefForCatalog = new ConsumedRouteRef({
  id: 'catalog.entity',
});

type SomeRouteRef = ConsumedRouteRef | RouteRef;
const createApp = ({
  plugins,
  routeAssociations,
}: {
  plugins: Plugin[];
  routeAssociations: SomeRouteRef[][];
}): React.ComponentType => {
  return;
};

const tinglePlugin = createPlugin({
  id: 'tingle',
  producesRoutes: {
    buildList: buildListRouteRef,
    // build: createRouteRef({ params: ['buildId'] }), // buildId
  },
  consumesRoutes: {
    entity: consumedEntityRouteRefForCatalog, // should be bound to the catalog
  },
});

const entityRouteRef = new RouteRef({ id: 'catalog.entity' });
const catalogPlugin = createPlugin({
  id: 'catalog',
  producesRoutes: {
    entity: entityRouteRef,
  },
  consumesRoutes: {},
});

const DerpContext = createContext();

const EntityLayout = () => {
  const params = useParams();
  const rrPath = useRouteRefPath(entityRouteRef);
  const path = createPath(rrPath, params); // /entity/my-entity
  return (
    <DerpContext.Provider value={{ routeRef: entityRouteRef, path }}>
      <div>
        <h1>This is entity layout!</h1>
        <Outlet />
      </div>
    </DerpContext.Provider>
  );
};

class RouteRefAssociation {
  path() {
    return '/derp';
  }
}

const association1 = new RouteRefAssociation();

const collectedRoutes = new Map<SomeRouteRef, RouteRefAssociation>([
  [entityRouteRef, assiciation1],
  [consumedEntityRouteRefForCatalog, assiciation1],
]);

const useLinkFunc = (routeRef: SomeRouteRef) => {
  const { giveUsTheRest } = useContext(AppContext);
  const parentPath = useParentPathFor(routeRef);
  const params = useParams();
  return (params?: any) => {
    // const parentPath = getParentFor(routeRef, params);
    const path = getPathFor(routeRef);
    const actualPath = applyParamsWithReactRouter(path, params);
    return parentPath + actualPath;

    return giveUsTheRest(params);
  };
};

const EntityOverviewPage = () => {
  const linkFunc = useLinkFunc(buildListRouteRef);
  return (
    <div>
      <a href={linkFunc()}>Linked here!</a>
    </div>
  );
};

const TingleBuilds = () => {
  return <div>You have arrived at Tingle Builds!</div>;
};

const App = createApp({
  plugins: [tinglePlugin, catalogPlugin],
  routeAssociations: [[consumedEntityRouteRefForCatalog, entityRouteRef]],
});

export const Experiment = () => {
  const elements = (
    <Routes>
      <Route path="/entity/:name" element={<EntityLayout />}>
        <Route path="/" element={<EntityOverviewPage />} />
        <Route path="/builds" element={<TingleBuilds />} />
      </Route>
    </Routes>
  );

  return elements;
};
