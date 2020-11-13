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

const ExtensionCollectionContext = createContext<Extension<unknown>[]>([]);

const useFirstRender = () => {
  const [firstRender, setFirstRender] = useState(true);

  useLayoutEffect(() => {
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

const MyComponent = () => {
  return <h1>BLOB</h1>;
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
    component: MyComponent,
    routeRef: myRouteRef,
  }),
);

// const MyPluginCard = myPlugin.exposeExtension(
//   createCardExtension({
//     component: MyComponentCard,
//   }),
// );

function createPageExtension(conf: {
  component: ComponentType<{}>;
  routeRef: RouteRef;
}): Extension<ComponentType<{ path: string }>> {
  const { component: Component, routeRef } = conf;
  return {
    expose(_plugin) {
      return ({ path }: { path: string }) => {
        const firstRender = useContext(FirstRenderContext);
        const extensions = useContext(ExtensionCollectionContext);

        if (firstRender) {
          extensions.push(`Received extension for path ${path}` as any);
          return null;
        }

        console.warn(path, 'mapped to path', routeRef);
        return <Component />;
      };
    },
  };
}

// function createCardExtension(conf: {}) {}

const BackstageRouter = ({ children }: PropsWithChildren<{}>) => {
  const firstRender = useContext(FirstRenderContext);
  const [extensions] = useState<Extension<unknown>[]>([]);

  if (firstRender) {
    return (
      <ExtensionCollectionContext.Provider value={extensions}>
        {children}
      </ExtensionCollectionContext.Provider>
    );
  }

  console.log('DEBUG: extensions =', extensions);

  return null;
};
