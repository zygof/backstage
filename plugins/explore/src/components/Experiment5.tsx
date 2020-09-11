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

type DerpElement = JSX.Element | JSX.Element[];
const DerpRoutes = ({ children }: { children: DerpElement }): JSX.Element => {
  const firstRender = useContext(FirstRenderContext);
  const routes = createRoutesFromChildren(children).map(r => ({
    ...r,
    path: `${r.path}/*`,
  }));

  const element = useRoutes(routes, '');

  if (firstRender) {
    return <>{children}</>;
  }

  return element!;
};

export const Experiment = () => {
  const firstRender = useFirstRender();

  return (
    <>
      <a href="/catalog/service/api">To Catalog entity</a>
      <FirstRenderContext.Provider value={firstRender}>
        <DerpRoutes>
          <Route path="/catalog" element={<EntityRoutes />} />
          <Route path="/catalog1" element={<EntityRoutes />} />
          <Route path="/catalog2" element={<EntityRoutes />} />
          <Route path="/catalog3" element={<EntityRoutes />} />
          <Route path="/catalog4" element={<EntityRoutes />} />
          <Route path="/catalog5" element={<EntityRoutes />} />
          <Route path="/catalog6" element={<EntityRoutes />} />
          <Route path="/catalog7" element={<EntityRoutes />} />
          <Route path="/catalog8" element={<EntityRoutes />} />
          <Route path="/catalog9" element={<EntityRoutes />} />
        </DerpRoutes>
      </FirstRenderContext.Provider>
    </>
  );
};

const RouteContext = createContext<string>('/');

const DerpRoute = ({
  path,
  element,
}: {
  path: string;
  element: ReactElement;
}) => {
  // const firstRender = useContext(FirstRenderContext);
  // const contentHolder = useContext(ContentContext);
  // const ctx = useContext(RouteContext);
  return <Route path={`${path}/*`} element={element} />;
};

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const firstRender = useContext(FirstRenderContext);

  if (firstRender) {
    return <DerpRoutes>{children}</DerpRoutes>;
  }

  return (
    <main>
      <h2>Layout</h2>
      <DerpRoutes>{children}</DerpRoutes>
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
  const firstRender = useContext(FirstRenderContext);
  // const ctx = useContext(RouteContext);
  if (firstRender) {
    return element;
  }
  return (
    <main>
      <h2>LayoutContent at {path}</h2>
      {element}
    </main>
  );
};

const EntityRoutes = () => (
  <DerpRoutes>
    {/* <>
      {new Array(10).fill(null).map((_, i) => (
        <Route key={i} path={`/website${i}`} element={<WebsiteEntityPage />} />
      ))}
    </> */}
    <Route path="/service" element={<ServiceEntityPage />} />
    <Route path="/website" element={<WebsiteEntityPage />} />
  </DerpRoutes>
);

const ServiceEntityPage = () => (
  <Layout>
    <LayoutContent path="/" element={<OverviewContent />} />
    <LayoutContent path="/api" element={<ApiDocsRouter />} />
  </Layout>
);

const WebsiteEntityPage = () => (
  <Layout>
    {/* {Array(10)
      .fill(0)
      .map((_, i) => (
        <LayoutContent key={i} path={`/${i}`} element={<OverviewContent />} />
      ))} */}
    <LayoutContent path="/" element={<OverviewContent />} />
    <LayoutContent path="/sentry" element={<SentryRouter />} />
  </Layout>
);

const anchorComponent = (Component: ComponentType) => {
  return () => {
    const firstRender = useContext(FirstRenderContext);
    if (firstRender) {
      return null;
    }

    return <Component />;
  };
};

const lazyAnchorComponent = (
  loadFunc: () => Promise<{ default: ComponentType<any> }>,
) => {
  return () => {
    const firstRender = useContext(FirstRenderContext);
    if (firstRender) {
      return null;
    }
    const { current: LazyComp } = useRef(React.lazy(loadFunc));

    return (
      <React.Suspense fallback="loading...">
        <LazyComp />
      </React.Suspense>
    );
  };
};

const OverviewContent = lazyAnchorComponent(() => import('./LoadMeLater'));

export const loadMeLaterRouteRef = createRouteRef({
  path: '/load-me-later',
});

export const LoadMeLaterRouter = plugin.anchorComponent({
  routeRef: loadMeLaterRouteRef,
  factory: () => import('./LoadMeLater'),
});

const ApiDocsRouter = anchorComponent(() => {
  renderTimings.push('leaf component');
  renderTimings.show();
  return <h3>ApiDocsRouter</h3>;
});
const SentryRouter = anchorComponent(() => {
  return <h3>SentryRouter</h3>;
});

// class RouteRef {
//   constructor(private path: string) {}

//   override(newPath: string) {
//     if (newPath !== this.path) {
//       this.path = newPath;
//     }
//   }

//   link(): string {
//     return this.path;
//   }

//   toString() {
//     return `routeRef{path=${this.path}}`;
//   }
// }

// const mountComponent = (routeRef: RouteRef, Component: ComponentType) => {
//   return () => {
//     console.log('DEBUG:mountComponent RENDERING routeRef =', routeRef);
//     const ctx = useContext(RouteContext);
//     const contentHolder = useContext(ContentContext);
//     routeRef.override(ctx);

//     contentHolder.push(<Route path={`${ctx}/*`} element={<Component />} />);
//     return null;
//   };
// };

// const rootRouteRef = new RouteRef('/');

// const plugin1RouteRef = new RouteRef('/plugin1');
// const plugin2RouteRef = new RouteRef('/plugin2');

// const page1RouteRef = new RouteRef('/page1');
// const page2RouteRef = new RouteRef('/page2');

// const Page1 = mountComponent(page1RouteRef, () => {
//   return (
//     <>
//       <h1>Page1</h1>
//       <a href={page2RouteRef.link()}>To Page2</a>
//     </>
//   );
// });

// const Page2 = mountComponent(page2RouteRef, () => {
//   return (
//     <div>
//       <h1>Page2</h1>
//     </div>
//   );
// });
