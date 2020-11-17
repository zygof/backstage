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

import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from 'react';
import { Entity } from '@backstage/catalog-model';
import { Grid } from '@material-ui/core';
import { Route, Routes, Outlet, useMatch, useLocation } from 'react-router-dom';

type ConceptSpec = {
  id: string;
  defaultRoute?: string;
};

type ResolvedConcept = {
  id: string;
  paramNames: string[];
  params(): Record<string, string>;
  route(params?: Record<string, string>): string;
};

type PluginSpec<
  ConceptsMap extends Record<string, ConceptSpec>,
  ComponentsMap extends Record<string, React.ComponentType<{}>>
> = {
  id: string;
  concepts: ConceptsMap;
  components: ComponentsMap;
};

function declarePlugin<
  ConceptsMap extends Record<string, ConceptSpec>,
  ComponentsMap extends Record<string, React.ComponentType<{}>>
>(
  spec: PluginSpec<ConceptsMap, ComponentsMap>,
): PluginSpec<ConceptsMap, ComponentsMap> {
  return spec;
}

function declareConcept(defaultRoute?: string): ConceptSpec {
  return { id: Math.random().toString(), defaultRoute };
}

function useConcept(spec: ConceptSpec | string): ResolvedConcept {}

// Catalog plugin

const CatalogPageHeader = () => {
  return <div>LE CATALOGUE</div>;
};

const catalogPlugin = declarePlugin({
  id: 'catalog',
  concepts: {
    root: declareConcept('/catalog'),
    entity: declareConcept('/entity/:kind/:namespace/:name'),
  },
  components: {
    CatalogPageHeader,
  },
});

const useEntity = (): Entity => {
  const { kind, namespace, name } = useMatch();
  return {} as Entity;
};

// Tingle plugin

const tinglePlugin = declarePlugin({
  id: 'tingle',
  concepts: {
    root: declareConcept('/tingle'),
    ownedBuilds: declareConcept('root?owner=me'),
    buildDetails: declareConcept('root/build/:buildId'),
    entityBuilds: declareConcept('catalog.entity/ci-cd'),
  },
  components: {},
});

const useBuilds = (entity: Entity): { buildId: string }[] => {
  return [{ buildId: '1234' }];
};

const EntityOngoingBuildsWidget = ({ entity }: { entity: Entity }) => {
  const buildDetailsConcept = useConcept(tinglePlugin.concepts.buildDetails);
  const builds = useBuilds(entity);
  return (
    <div>
      <ul>
        {builds.map(build => (
          <li key={build.buildId}>
            <a href={buildDetailsConcept.route({ buildId: build.buildId })}>
              {build.buildId}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// App

const config = `
  app:
    routing:
      catalog:
        root: /catalog
        entity: /entity/:kind/:namespace/:name
      tingle:
        root: /tingle
        entityBuilds: catalog.entity/ci-cd
        ownedBuilds: /builds
`;

const EntityOverviewPage = () => {
  const entity = useEntity();
  const plugin = usePlugin(tinglePlugin);
  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <EntityOngoingBuildsWidget entity={entity} />
          <TingleBuildsPage />
          <tingle.BuildsPage />
        </Grid>
      </Grid>
    </div>
  );
};

const CatalogPage = () => {
  return <PageChrome />;
};

const CatalogOverviewPage = () => {
  return <>{children}</>;
};

type RouteRegistry = {
  bind(concept: ConceptSpec, path: string): void;
};
class RouteRegistryImpl implements RouteRegistry {
  bind(concept: ConceptSpec, path: string): void {}
}
const registry = new RouteRegistryImpl();
const routeRegistryContext = createContext<RouteRegistry>(registry);
const RouteRegistryProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <routeRegistryContext.Provider value={registry}>
      {children}
    </routeRegistryContext.Provider>
  );
};

const PageWrapper = ({
  concept,
  element,
  children,
}: PropsWithChildren<{ concept: ConceptSpec; element: JSX.Element }>) => {
  const isFirstRender = useRef(false);
  const routeRegistry = useContext(routeRegistryContext);
  const location = useLocation();

  if (isFirstRender.current) {
    isFirstRender.current = false;
    routeRegistry.bind(concept, '');
  }
};

const TheApp = () => {
  const catalog = usePlugin(catalogPlugin);
  return (
    <RouteRegistryProvider>
      <Routes>
        <Route path="/catalog" element={} />
        <Route path="/entity/:namespace/:kind/:name" element={}>
          <Route path="/" element={} />
          <Route path="/ci-cd" element={} />
          <Route path="/docs" element={} />
        </Route>
        <Route path="/tingle" element={}>
          <Route path="/" element={} />
          <Route path="/:buildId" element={} />
        </Route>
      </Routes>
    </RouteRegistryProvider>
  );
};
