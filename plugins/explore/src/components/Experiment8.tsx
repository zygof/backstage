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

class RouteRef {}
class Plugin {
  exposeExtension(Extension: Extension): ComponentType {
    return Extension.expose(this);
  }
}

type Extension<T> = {
  expose(plugin: Plugin): T;
};

type ExtensionData = { data: unknown; type: string };

const myPlugin = new Plugin();

const myRouteRef = new RouteRef();

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
    .map(({ Component, props }) => <Component {...props} />);

  return (
    <div>
      <h1>HERES SOME WIDGETS</h1>
      {widgets}
    </div>
  );
};

const MyComposableWidgetComponent = ({
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
      <h1>HERES SOME COMPOSED WIDGETS BRO YEEZY WIDGEZEPTION</h1>
      {widgets}
    </div>
  );
};

const MyPage = myPlugin.exposeExtension(
  createPageExtension({
    component: MyPageComponent,
    routeRef: myRouteRef,
  }),
);

const MyWidgetPage = myPlugin.exposeExtension(
  createPageExtensionPoint({
    component: MyWidgetPageComponent,
    routeRef: myRouteRef,
  }),
);

const MyWidget = myPlugin.exposeExtension(
  createWidgetExtension({
    component: MyWidgetComponent,
  }),
);

const MyMultiWidget = myPlugin.exposeExtension(
  createWidgetExtensionPoint({
    component: MyComposableWidgetComponent,
  }),
);

function createWidgetExtensionPoint(conf: {
  component: ComponentType<{ extensions: ExtensionData }>;
  routeRef: RouteRef;
}): Extension<ComponentType<{}>> {
  const { component: Component } = conf;
  return {
    expose(_plugin) {
      const Wrapper = ({ children }: PropsWithChildren<{}>) => children;

      Wrapper.extension = {
        data: { Component },
        type: 'WIDGET',
        collect(children: any): any {
          const extensions = React.Children.map(
            children,
            child => child.type.extension,
          );
          return { extensions };
        },
      };
      return Wrapper;
    },
  };
}

function createWidgetExtension(conf: {
  component: ComponentType<{}>;
}): Extension<ComponentType<{}>> {
  const { component: Component } = conf;

  return {
    expose(_plugin) {
      const Wrapper = () => null;
      Wrapper.extension = { data: { Component }, type: 'WIDGET' };
      return Wrapper;
    },
  };
}

function createPageExtensionPoint(conf: {
  component: ComponentType<{ extensions: ExtensionData }>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      const Wrapper = ({ children }: PropsWithChildren<{}>) => children;

      Wrapper.extension = {
        data: { Component, routeRef },
        type: 'PAGE',
        collect(children: any): any {
          const extensions = React.Children.map(children, child => {
            const { extension } = child.type;
            const props = extension.collect?.(child.props?.children);
            return { ...extension, data: { ...extension.data, props } };
          });
          return { extensions };
        },
      };
      return Wrapper;
    },
  };
}

export const Experiment = () => {
  return (
    <BackstageRouter>
      <MyWidgetPage path="/my-widgets">
        <MyWidget />
        <MyMultiWidget>
          <MyWidget />
        </MyMultiWidget>
      </MyWidgetPage>
      <MyPage path="/my-thing" />
    </BackstageRouter>
  );
};

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
      const Wrapper = () => null;
      Wrapper.extension = { data: { Component, routeRef }, type: 'PAGE' };
      return Wrapper;
    },
  };
}

const BackstageRouter = ({ children }: PropsWithChildren<{}>) => {
  const routes = React.Children.map(
    children,
    ({
      type: {
        extension: {
          data: { Component },
          collect,
        },
      },
      props,
    }) => {
      const collectedProps = collect?.(props.children) ?? {};
      return {
        element: <Component {...collectedProps} />,
        path: `${props.path}/*`,
      };
    },
  );
  console.log('DEBUG: routes =', routes);

  return useRoutes(routes!, '');
};
