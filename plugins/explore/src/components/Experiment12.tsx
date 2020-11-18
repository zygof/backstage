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

class RouteRef {
  constructor(private readonly name: string) {}

  toString() {
    return `routeRef{${this.name}}`;
  }
}

function createRouteRef() {
  return new RouteRef(Math.random().toString());
}

type PluginSpec = {
  id: string;
  routes: { [name: string]: RouteRef };
};

function createPlugin(spec: PluginSpec): PluginSpec {
  return spec;
}

class Plugin {
  exposeExtension(extension: Extension): ComponentType {
    return extension.expose(this);
  }
}

type Extension<T> = {
  expose(plugin: Plugin): T;
};

const myPlugin = new Plugin();

const MyWidgetComponent = () => {
  return <h1>IMMA WIDGIT</h1>;
};

const MyPageComponent = () => {
  return <h1>IMMA PAGE</h1>;
};

const MyWidgetPageComponent = ({ children }: any) => {
  const widgets = React.Children.map(
    children,
    (child, index) =>
      console.log(
        'DEBUG: getInternalNodeData(child) =',
        child,
        getInternalNodeData(child),
      ) || (
        <div key={index}>
          Widget of size {getInternalNodeData(child)?.data?.size} {child}
        </div>
      ),
  );

  return (
    <div>
      <h1>HERES SOME WIDGETS</h1>
      {widgets}
    </div>
  );
};

const MyPage = myPlugin.exposeExtension(
  createRoutableExtension({
    component: MyPageComponent,
    routeRef: new RouteRef('page'),
  }),
);

const MyWidgetPage = myPlugin.exposeExtension(
  createRoutableExtension({
    component: MyWidgetPageComponent,
    routeRef: new RouteRef('widget-page'),
  }),
);

const MyWidget1 = myPlugin.exposeExtension(
  createWidgetExtension({
    component: MyWidgetComponent,
    size: 1,
  }),
);

const MyWidget2 = myPlugin.exposeExtension(
  createWidgetExtension({
    component: MyWidgetComponent,
    size: 2,
  }),
);

const EntityContext = React.createContext<Entity>({
  kind: 'component',
  name: 'wat',
});

const EntityRouterComponent = ({ children }) => {
  console.log(`DEBUG: RENDER LE ENTITY ROOOUTE`);
  return (
    <EntityContext.Provider value={{ kind: 'component', name: 'waaaaaaaat' }}>
      {children}
    </EntityContext.Provider>
  );
};

const EntityRouter = myPlugin.exposeExtension(
  createRoutableExtension({
    routeRef: new RouteRef('entity-router'),
    component: EntityRouterComponent,
  }),
);

const EntityFilter = ({ filter, children }) => {
  const entity = useContext(EntityContext);
  if (filter(entity)) {
    return children;
  }
  return null;
};

const EntityPageComponent = ({ children }) => {
  return <div style={{ backgroundColor: 'blue' }}>{children}</div>;
};

const EntityPage = myPlugin.exposeExtension(
  createComponentExtension({
    component: EntityPageComponent,
  }),
);

type Entity = {
  kind: string;
  name: string;
};

const rootRouteRef = new RouteRef('root-route-ref');

function isJsxElement(node: ReactNode): node is JSX.Element {
  return typeof node === 'object' && node !== null && 'props' in node;
}

function collectAllTheThings(parentRoute: RouteRef, root: ReactNode) {
  return React.Children.forEach(root, (child: ReactNode) => {
    if (!isJsxElement(child)) {
      return;
    }

    const { path, element, children } = child.props as {
      path?: string;
      element?: ReactNode;
      children?: ReactNode;
    };

    if (path) {
      const internalData = getInternalNodeData(child);
      if (internalData?.type === 'core.routable') {
        const { routeRef } = internalData.data as { routeRef: RouteRef };
        console.log(
          `Found native route at ${routeRef} at ${path} with parent ${parentRoute}`,
        );
        collectAllTheThings(routeRef, children);
      } else if (isJsxElement(element)) {
        const elementData = getInternalNodeData(element);
        if (elementData) {
          const { routeRef } = elementData.data as { routeRef: RouteRef };

          console.log(
            `Found rr route at ${routeRef} at ${path} with parent ${parentRoute}`,
          );
          collectAllTheThings(routeRef, element.props?.children);
        } else {
          collectAllTheThings(parentRoute, element.props?.children);
        }
      }
    } else {
      collectAllTheThings(parentRoute, children);
    }
  });
}

const catalogPlugin = createPlugin({
  id: 'catalog',
  routes: {
    root: createRouteRef(),
    entity: cre,
  },
});

const tinglePlugin = createPlugin({
  id: 'tingle',
  routes: {},
});

export const Experiment = () => {
  const elements = (
    <BackstageRouter>
      <MyWidgetPage path="/my-widgets">
        <MyWidget1 />
        <MyWidget2 />
      </MyWidgetPage>
      <Route path="/my-thing" element={<MyPage />} />

      <EntityRouter path="/entity/:kind/:name">
        <EntityFilter filter={({ kind }) => kind === 'component'}>
          <EntityPage>
            <div>HYEAAAAAAAAAH</div>
            dlfgkjhdfg
            <Routes>
              <MyPage path="/my-thang" />
              <Route path="/my-thung" element={<MyPage />} />
              <MyWidgetPage path="/my-widgets">
                <MyWidget1 />
                <MyWidget2 />
              </MyWidgetPage>
            </Routes>
          </EntityPage>
        </EntityFilter>
      </EntityRouter>
    </BackstageRouter>
  );

  const allTheThings = collectAllTheThings(rootRouteRef, elements);

  return elements;
};

function createRoutableExtension(conf: {
  component: ComponentType<{ path: string }>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component, routeRef } = conf;
  return createReactExtension({
    component,
    data: { routeRef },
    type: 'core.routable',
  });
}

function createWidgetExtension(conf: {
  component: ComponentType<{}>;
  size: number;
}): Extension<ComponentType<{}>> {
  const { component, size } = conf;
  return createReactExtension({
    component,
    data: { size },
    type: 'core.widget',
  });
}

function createComponentExtension({
  component,
}: {
  component: ComponentType<{}>;
}): Extension<ComponentType<{}>> {
  return createReactExtension({ component, type: 'core.component' });
}

function createReactExtension<T extends {}>(conf: {
  component: ComponentType<T>;
  type: string;
  data?: object;
}): Extension<ComponentType<T>> {
  const { component: Component, data = {}, type } = conf;
  return {
    expose(plugin) {
      const Wrapper = (props: T) => <Component {...props} />;
      Wrapper.__BACKSTAGE_INTERNAL_DATA = { type, data, plugin };
      return Wrapper;
    },
  };
}

type WrapperData = { type: string; data: object; plugin?: Plugin };
type WrapperNode = ReactNode & {
  type: { __BACKSTAGE_INTERNAL_DATA?: WrapperData };
};

function getInternalNodeData(node: ReactNode): WrapperData | undefined {
  if (!node) {
    return undefined;
  }
  const wrapperNode = node as WrapperNode;
  const data = wrapperNode.type.__BACKSTAGE_INTERNAL_DATA;
  return data ?? undefined;
}

const BackstageRouterComponent = ({ children }: PropsWithChildren<{}>) => {
  const routes = createRoutesFromChildren(children).map(r => ({
    ...r,
    path: `${r.path}/*`,
  }));
  return useRoutes(routes, '');
};

const BackstageRouter = myPlugin.exposeExtension(
  createRoutableExtension({
    component: BackstageRouterComponent,
    routeRef: rootRouteRef,
  }),
);
