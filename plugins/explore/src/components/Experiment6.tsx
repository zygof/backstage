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
} from 'react-router';

class RenderTimings {
  timings: { name: string; time: number }[] = [];

  constructor() {
    this.push('script execution start');
  }

  push(name: string) {
    this.timings.push({ name, time: performance.now() });
  }

  show() {
    console.log('RENDER TIMINGS');
    const base = this.timings[0].time;

    for (const [index, { name, time }] of this.timings.entries()) {
      const diff = index > 0 ? time - this.timings[index - 1]!.time : 0;
      console.log(`${name} time=${time - base}   diff=${diff}`);
    }
  }
}

const renderTimings = new RenderTimings();

const FirstRenderContext = createContext<boolean>(false);

const useFirstRender = () => {
  const [firstRender, setFirstRender] = useState(true);

  renderTimings.push(`call useFirstRender, firstRender: ${firstRender}`);
  useLayoutEffect(() => {
    // renderTimings.push('useFirstRender layout effect');
    setFirstRender(false);
    // setTimeout(() => {
    // }, 1000);
  }, []);

  return firstRender;
};

class RouteRef {
  constructor(private path: string) {}

  // override(newPath: string) {
  //   if (newPath !== this.path) {
  //     this.path = newPath;
  //   }
  // }

  link(): string {
    return this.path;
  }

  toString() {
    return `routeRef{path=${this.path}}`;
  }
}

const rootRouteRef = new RouteRef('/');
const catalogRouteRef = new RouteRef('/catalog');

const serviceRouteRef = new RouteRef('/service');
const websiteRouteRef = new RouteRef('/website');

const overviewRouteRef = new RouteRef('/overview');
const apiDocsRouteRef = new RouteRef('/api-docs');
const sentryRouteRef = new RouteRef('/sentry');

const RouteContext = createContext<RouteRef[]>([]);
const DerpContext = createContext<
  (path: string, routeRefs: RouteRef[]) => void
>(() => {});

type DerpElement = JSX.Element | JSX.Element[];

const DerpRoutes = ({
  children,
  routeRef,
}: {
  children: DerpElement;
  routeRef: RouteRef;
}): JSX.Element => {
  const derp = useContext(DerpContext);
  const firstRender = useContext(FirstRenderContext);
  const routes = createRoutesFromChildren(children).map(r => ({
    ...r,
    path: `${r.path}/*`,
  }));

  const element = useRoutes(routes, '');

  if (firstRender) {
    const derpCallback = (path: string, childRouteRefs: RouteRef[]) => {
      derp(path, [routeRef, ...childRouteRefs]);
    };

    return (
      <DerpContext.Provider value={derpCallback}>
        {children}
      </DerpContext.Provider>
    );
  }

  return element!;
};

// const catalogRouteRef = new RouteRef('/catalog');
// const entityRouteRef = new RouteRef('/catalog/:name');
// const entityRouteRef = catalogRouteRef.createSubRoute(':name'); // /catalog/:name

//        /catalog/service/my-entity-name/

export const Experiment = () => {
  const firstRender = useFirstRender();

  const derpCallback = (path: string, childRouteRefs: RouteRef[]) => {
    console.log(`DEBUG: ${path} bound to ${childRouteRefs.join(' -> ')}`, path);
  };

  return (
    <>
      <a href="/catalog/service/:name/api">To Catalog entity</a>
      <DerpContext.Provider value={derpCallback}>
        <FirstRenderContext.Provider value={firstRender}>
          <DerpRoutes routeRef={rootRouteRef}>
            {/*           <CatalogIndexPage path='/catalog'/>

          <CatalogEntityPage path='/catalog'>
            <ServiceEntityPage path="/service/:name" />
            <WebsiteEntityPage path="/website/:name" />
            <DefaultEntityPage path="/:type/:name" />
          <CatalogEntityPage>

         <ExplorePluginPage path="/explore" />

          <DerpRoutes path='/catalog' routeRef={entityRouteRef}>
            <ServiceEntityPage path="/service/:name" />
            <WebsiteEntityPage path="/website/:name" />
            <DefaultEntityPage path="/:type/:name" />
          <DerpRoutes>

             */}
            <DerpRoute path="/catalog" element={<EntityRoutes />} />
          </DerpRoutes>
        </FirstRenderContext.Provider>
      </DerpContext.Provider>
    </>
  );
};

const DerpRoute = ({
  path,
  element,
}: {
  path: string;
  element: ReactElement;
}) => {
  const derp = useContext(DerpContext);

  const derpCallback = (childPath: string, childRouteRefs: RouteRef[]) => {
    derp(childPath || path, childRouteRefs);
  };

  // const firstRender = useContext(FirstRenderContext);
  // const contentHolder = useContext(ContentContext);
  // const parentRouteRef = useContext(RouteContext);
  // console.log(`${path} bound to ${parentRouteRef}`);
  return (
    <DerpContext.Provider value={derpCallback}>
      <Route path={`${path}/*`} element={element} />;
    </DerpContext.Provider>
  );
};

const Layout = ({
  children,
  routeRef,
}: {
  children: JSX.Element | JSX.Element[];
  routeRef: RouteRef;
}) => {
  const firstRender = useContext(FirstRenderContext);

  if (firstRender) {
    return <DerpRoutes routeRef={routeRef}>{children}</DerpRoutes>;
  }

  return (
    <main>
      <h2>Layout</h2>
      <DerpRoutes routeRef={routeRef}>{children}</DerpRoutes>
    </main>
  );
};

const LayoutContent = ({
  path,
  element,
}: {
  path: string;
  element: ReactElement;
}) => {
  const derp = useContext(DerpContext);

  const derpCallback = (childPath: string, childRouteRefs: RouteRef[]) => {
    derp(childPath || path, childRouteRefs);
  };
  const firstRender = useContext(FirstRenderContext);
  // const ctx = useContext(RouteContext);
  if (firstRender) {
    return (
      <DerpContext.Provider value={derpCallback}>
        {element}
      </DerpContext.Provider>
    );
  }
  return (
    <main>
      <h2>LayoutContent at {path}</h2>
      {element}
    </main>
  );
};

const EntityRoutes = () => (
  <DerpRoutes routeRef={catalogRouteRef}>
    {/* <>
      {new Array(10).fill(null).map((_, i) => (
        <DerpRoute key={i} path={`/website${i}`} element={<WebsiteEntityPage />} />
      ))}
    </> */}
    <DerpRoute path="/service" element={<ServiceEntityPage />} />
    <DerpRoute path="/website" element={<WebsiteEntityPage />} />
  </DerpRoutes>
);

const ServiceEntityPage = () => (
  <Layout routeRef={serviceRouteRef}>
    <LayoutContent path="/" element={<OverviewRouter />} />
    <LayoutContent path="/api" element={<ApiDocsRouter />} />
  </Layout>
);

const WebsiteEntityPage = () => (
  <Layout routeRef={websiteRouteRef}>
    {/* {Array(10)
      .fill(0)
      .map((_, i) => (
        <LayoutContent key={i} path={`/${i}`} element={<OverviewRouter />} />
      ))} */}
    <LayoutContent path="/" element={<OverviewRouter />} />
    <LayoutContent path="/sentry" element={<SentryRouter />} />
  </Layout>
);

const anchorComponent = (routeRef: RouteRef, Component: ComponentType) => {
  return () => {
    const firstRender = useContext(FirstRenderContext);
    const derp = useContext(DerpContext);
    // const [routeRefs, path] = useContext(RouteContext)
    if (firstRender) {
      derp('', [routeRef]);
      return null;
    }

    return <Component />;
  };
};

const useResolvedRouteRefLinkThisIsInternal = (...routeRefs: RouteRef[]) {

}

const useLink = (routeRef: RouteRef) => {
  const parentRouteRefs = useContext(RouteContext)

  return useResolvedRouteRefLinkThisIsInternal(...parentRouteRefs, routeRef)
}

const OverviewRouter = anchorComponent(overviewRouteRef, () => {
  return <h3>OverviewRouter</h3>;
});
const ApiDocsRouter = anchorComponent(apiDocsRouteRef, () => {




  const docsRouteRef = createRouteRef('/docs')
  const docsPageRouteRef = docRouteRef.createSubRoute('/:path')
  docsPageRouteRef.link({path: 'page1'})// ->  '/docs/page1'


    // we're in CI/CD

  const docsLink = useRelativeLink(docRouteRef)

  /*
  /catalog/x/ci-cd <- we are here
  /catalog/x/docs
  /docs


  /catalog/x/docs/page1

  */

  const deepDocsLink = useRelativeLink(docsPageRouteRef.link({path: '/page1'}))

  const sentryLink2 = useLink(catalogRouteRef, serviceRouteRef, sentryRouteRef)
  renderTimings.push('leaf component');
  renderTimings.show();
  return <h3>ApiDocsRouter</h3>;
});
const SentryRouter = anchorComponent(sentryRouteRef, () => {
  return <h3>SentryRouter</h3>;
});

console.log(
  `binding /api to ${rootRouteRef} ${catalogRouteRef} ${serviceRouteRef} ${apiDocsRouteRef}`,
);
