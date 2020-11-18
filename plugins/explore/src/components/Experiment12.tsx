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
  Router,
  createRoutesFromChildren,
  useRoutes,
  useMatch,
  useParams,
} from 'react-router';

class RouteRef {
  constructor(private readonly name: string) {}

  toString() {
    return `routeRef{${this.name}}`;
  }
}

type Extension<T> = {
  expose(plugin: Plugin): T;
};

function createRouteRef() {
  return new RouteRef(Math.random().toString());
}

type PluginSpec = {
  id: string;
  producesRoutes?: { [name: string]: RouteRef };
  consumesRoutes?: { [name: string]: RouteRef };
};

type Plugin = {
  id: string;
  producesRoutes: { [name: string]: RouteRef };
  consumesRoutes: { [name: string]: RouteRef };
  exposeExtension(extension: Extension<ComponentType>): ComponentType;
};

function createPlugin(spec: PluginSpec): Plugin {
  const { id, producesRoutes = {}, consumesRoutes = {} } = spec;
  return {
    id,
    producesRoutes,
    consumesRoutes,
    exposeExtension(extension: Extension<ComponentType>): ComponentType {
      return extension.expose(this);
    },
  };
}

type Entity = {
  kind: string;
  name: string;
};

type BackstageContext = {
  currentEntity: Entity;
};

/* ************************************************************************* */
// CATALOG
/* ************************************************************************* */

const catalogPlugin = createPlugin({
  id: 'catalog',
  producesRoutes: {
    catalog: createRouteRef(),
    entity: createRouteRef({ id: 'catalog.entity' }), // <-- what about params kind,namespace,name
  },
});

export function useContextualEntity(): Entity {}

/* ************************************************************************* */
// TINGLE
/* ************************************************************************* */

// on /builds, /tingle/builds/:buildId
const tinglePlugin = createPlugin({
  id: 'tingle',
  producesRoutes: {
    ownedBuilds: createRouteRef(),
    entityBuilds: createRouteRef(), // entityRef?
    build: createRouteRef({ params: ['buildId'] }), // buildId
  },
  consumesRoutes: {
    entity: createConsumedRouteRef({ id: 'catalog.entity' }), // should be bound to the catalog
  },
});

/*

/entity/:kind/:namespace/:name/builds/:buildId


/entity/:kind/:namespace/:name <- catalogPlugin.routes.entity

/builds/:buildId <- tinglePlugin.routes.build

*/

const concreteBuildPageRouteRef = createConcreteRouteRef(
  catalogPlugin.routes.entity,
  tinglePlugin.routes.build,
);

const buildsPageHref = app.createConcreteLink(
  concreteBuildPageRouteRef.build([{ kind: 'asd' }, { buildId: 'asdasd' }]),
);

const OwnedBuildsPage = () => {
  const { user } = useApi(identityApiRef);
};

//
const EntityBuildsWidget = () => {
  const entity = useContextualEntity();
  const buildPathResolver = useRefResolver(tinglePlugin.producesRoutes.build);
  const builds: { buildId: string }[] = useBuilds(entity);
  return (
    <ul>
      {builds.map(({ buildId }) => (
        <li>
          <Link to={buildPathResolver({ buildId })}>{buildId}</Link>
        </li>
      ))}
    </ul>
  );
};

// This would be tab contents right?
const EntityBuildsPage = () => {
  const entity = useContextualEntity();
};

const SingleBuildDetailsPage = () => {
  const { buildId } = useParams();
};

/* ************************************************************************* */
// APP
/* ************************************************************************* */

const Sidebar = ({ routeRefs }) => {
  return (
    <ul>
      <AppBarItem
        title="Something"
        to={catalogPlugin.exposes.catalogRootPage}
      />
      <AppBarItem title="Somethang" />
      <AppBarItem title="Somethung" />
    </ul>
  );
};

createApp({
  linkedRoutes: [
    [catalogPlugin.producesRoutes.entity, tinglePlugin.consumesRoutes.entity],
  ],
});

const rootRouteRef = createRouteRef();

// This would be tab contents right?
const EntityBuildsPageWrapper = () => {
  const { kind, namespace, name } = useParams();
  const entity = useEntity(kind, namespace, name);
  return <EntityBuildsPage entity={entity} />;
};

// Shows a builds widget that wants to link to a build
const EntityOverviewPage = () => {
  return (
    <div>
      <EntityBuildsWidget />
    </div>
  );
};

export const Experiment = () => {
  const elements = (
    <Bindings
      bindings={[
        [a, ''],
        [b, ''],
      ]}
    >
      <Router>
        <Route path="/my-thing" element={<Page />} />
        <Route path="/tingle" element={<TingleRoot />}>
          <Route path="/:buildId" element={<SingleBuildDetailsPage />} />
        </Route>
      </Router>
    </Bindings>
  );

  return elements;
};
