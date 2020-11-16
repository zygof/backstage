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

const FirstRenderContext = createContext<boolean>(false);

const ExtensionCollectionContext = createContext<
  { type: string; data: unknown }[]
>([]);

const useFirstRender = () => {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return firstRender;
};

export const Experiment = () => {
  const firstRender = useFirstRender();

  return (
    <FirstRenderContext.Provider value={firstRender}>
      <BackstageRouter>
        {/* <Backstage  Route path="/my-thing" Extension={<MyPage />} /> */}
        <MyWidgetPage path="/my-widgets">
          <MyWidget />
        </MyWidgetPage>
        <MyPage path="/my-thing" />
      </BackstageRouter>
    </FirstRenderContext.Provider>
  );
};

class RouteRef {}
class Plugin {
  exposeExtension(Extension: Extension): ComponentType {
    return Extension.expose(this);
  }
}

type Extension<T> = {
  expose(plugin: Plugin): T;
};

const myPlugin = new Plugin();

const myRouteRef = new RouteRef();

// const EMPTY_ARRAY = [];
const useExtensions = (
  children: PropsWithChildren<{}>['children'],
): readonly [{ type: string; data: unknown }[], JSX.Element | undefined] => {
  const firstRender = useContext(FirstRenderContext);
  console.log('DEBUG: useext firstRender =', firstRender);
  const [exts] = useState<{ type: string; data: unknown }[]>([]);
  console.log('DEBUG: exts =', exts);
  window.derpA = exts;

  useEffect(() => {
    return () => {
      console.log(`DEBUG: UNMOUNTED WUT`);
    };
  });

  if (firstRender) {
    return [
      [],
      <ExtensionCollectionContext.Provider value={exts}>
        {children}
      </ExtensionCollectionContext.Provider>,
    ];
  }

  return [exts, undefined];
};

const MyWidgetComponent = () => {
  return <h1>IMMA WIDGIT</h1>;
};

const MyPageComponent = () => {
  return <h1>IMMA PAGE</h1>;
};

const MyWidgetPageComponent = ({
  extensions,
}: {
  extensions: { type: string; data: unknown }[];
}) => {
  const widgets = extensions
    .filter(({ type }) => type === 'WIDGET')
    .map(({ data }) => data as Pick<PageExtensionData, 'Component'>)
    .map(({ Component }) => <Component />);

  return (
    <div>
      <h1>HERES SOME WIDGETS</h1>
      {widgets}
    </div>
  );
};
// const MyComponentCard = () => {
//   return (
//     <div>
//       <p>Something</p>
//     </div>
//   );
// };

const MyPage = myPlugin.exposeExtension(
  createPageExtension({
    component: MyPageComponent,
    routeRef: myRouteRef,
  }),
);

const MyWidgetPage = myPlugin.exposeExtension(
  createComposablePageExtension({
    component: MyWidgetPageComponent,
    routeRef: myRouteRef,
    widgets: [MyW],
  }),
);

const MyWidget = myPlugin.exposeExtension(
  createWidgetExtension({
    component: MyWidgetComponent,
  }),
);

// const MyPluginCard = myPlugin.exposeExtension(
//   createCardExtension({
//     component: MyComponentCard,
//   }),
// );

function createWidgetExtension(conf: {
  component: ComponentType<{}>;
}): Extension<ComponentType<{}>> {
  const { component: Component } = conf;

  return {
    expose(_plugin) {
      return () => {
        const firstRender = useContext(FirstRenderContext);
        const extensions = useContext(ExtensionCollectionContext);

        console.log('DEBUG: WIDGET EXT firstRender =', firstRender);
        if (firstRender) {
          console.log('DEBUG: extensions =', extensions);
          extensions.push({ data: { Component }, type: 'WIDGET' });
          window.derpB = extensions;
        }

        return null;
      };
    },
  };
}

type PageExtensionData = {
  path: string;
  Component: ComponentType<{}>;
  routeRef: RouteRef;
};

function createPageExtension(conf: {
  component: ComponentType<{}>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      return ({ path, children }: PropsWithChildren<{ path: string }>) => {
        const firstRender = useContext(FirstRenderContext);
        const extensions = useContext(ExtensionCollectionContext);

        if (firstRender) {
          const data: PageExtensionData = {
            path,
            Component: <Component children={children} />,
            routeRef,
          };
          extensions.push({ data, type: 'PAGE' });
          return <>{children}</>;
        }

        return null;
      };
    },
  };
}

function createComposablePageExtension(conf: {
  component: ComponentType<{}>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      return ({ path, children }: PropsWithChildren<{ path: string }>) => {
        const firstRender = useContext(FirstRenderContext);
        const extensions = useContext(ExtensionCollectionContext);

        const [collectedExtensions, collector] = useExtensions(children);

        useLayoutEffect(() => {
          if (firstRender) {
            console.log('DEBUG: collectedExtensions =', collectedExtensions);
            const data: PageExtensionData = {
              path,
              Component: (
                <Component extensions={collectedExtensions}>
                  {children}
                </Component>
              ),
              routeRef,
            };
            extensions.push({ data, type: 'PAGE' });
          }
        }, [firstRender]);

        if (collector) {
          return collector;
        }

        return null;
      };
    },
  };
}

// function createCardExtension(conf: {}) {}

const BackstageRouter = ({ children }: PropsWithChildren<{}>) => {
  const firstRender = useContext(FirstRenderContext);
  console.log('DEBUG: router firstRender =', firstRender);
  const [exts] = useState<{ type: string; data: unknown }[]>([]);

  if (firstRender) {
    return (
      <ExtensionCollectionContext.Provider value={exts}>
        {children}
      </ExtensionCollectionContext.Provider>
    );
  }

  const Router = ({
    extensions,
  }: {
    extensions: { type: string; data: unknown }[];
  }) => {
    const pageExtensions = extensions
      .filter(({ type }) => type === 'PAGE')
      .map(({ data }) => data as PageExtensionData)
      .map(({ Component, path }) => ({ element: Component, path }));

    return useRoutes(pageExtensions, '');
  };

  return <Router extensions={exts} />;
};
