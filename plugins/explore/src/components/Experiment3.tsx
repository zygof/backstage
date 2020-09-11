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
} from 'react';
import { Route, Routes } from 'react-router';

class ContentHolder {
  private readonly nodes: ReactNode[] = [];

  push(node: ReactNode) {
    this.nodes.push(
      <React.Fragment key={this.nodes.length}>{node}</React.Fragment>,
    );
  }

  content(): ReactNode {
    return this.nodes;
  }
}

const ContentContext = createContext<{ push: (node: ReactNode) => void }>(
  new ContentHolder(),
);

const FirstRenderContext = createContext<boolean>(false);

const useFirstRender = () => {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFirstRender(false);
    }, 1000);
  }, []);

  return firstRender;
};

const DerpRoutes = ({ children }: PropsWithChildren<{}>) => {
  const firstRender = useFirstRender();
  const { current: contentHolder } = useRef(new ContentHolder());

  if (firstRender) {
    return (
      <FirstRenderContext.Provider value>
        <ContentContext.Provider value={contentHolder}>
          {children}
        </ContentContext.Provider>
      </FirstRenderContext.Provider>
    );
  }

  return <Routes>{contentHolder.content()}</Routes>;
};

export const Experiment = () => {
  return (
    <>
      <a href="/catalog/service/api">To Catalog entity</a>
      <DerpRoutes>
        <DerpRoute path="/catalog" element={<EntityRoutes />} />
      </DerpRoutes>
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
  const firstRender = useContext(FirstRenderContext);
  const contentHolder = useContext(ContentContext);
  // const ctx = useContext(RouteContext);
  if (firstRender) {
    contentHolder.push(<Route path={`${path}/*`} element={element} />);
    return element;
  }
  return null;
};

const Layout = ({ children }: PropsWithChildren<{}>) => {
  const firstRender = useContext(FirstRenderContext);
  const { current: contentHolder } = useRef(new ContentHolder());

  useEffect(() => {
    return () => {
      console.log(`DEBUG: OH NOES`);
    };
  }, []);

  if (firstRender) {
    return (
      <ContentContext.Provider value={contentHolder}>
        {children}
      </ContentContext.Provider>
    );
  }

  console.log('DEBUG: contentHolder.content() =', contentHolder.content());
  return (
    <main>
      <h2>Layout</h2>
      <Routes>{contentHolder.content()}</Routes>
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
  const contentHolder = useContext(ContentContext);
  // const ctx = useContext(RouteContext);
  if (firstRender) {
    console.log('DEBUG: push to contentHolder =', contentHolder);
    contentHolder.push(
      <Route
        path={`${path}/*`}
        element={
          <main>
            <h2>LayoutContent at {path}</h2>
            {element}
          </main>
        }
      />,
    );
    return element;
  }
  return null;
};

const EntityRoutes = () => (
  <DerpRoutes>
    <DerpRoute path="/service" element={<ServiceEntityPage />} />
    <DerpRoute path="/website" element={<WebsiteEntityPage />} />
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

const OverviewContent = anchorComponent(() => {
  return <h3>OverviewContent</h3>;
});
const ApiDocsRouter = anchorComponent(() => {
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
