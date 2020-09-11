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
  ComponentType,
  ReactNode,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
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

const DerpRoutes = ({ children }: PropsWithChildren<{}>) => {
  const [firstRender, setFirstRender] = useState(true);
  const { current: contentHolder } = useRef(new ContentHolder());

  useEffect(() => {
    setFirstRender(false);
  }, []);

  if (firstRender) {
    return (
      <ContentContext.Provider value={contentHolder}>
        {children}
      </ContentContext.Provider>
    );
  }

  return <Routes>{contentHolder.content()}</Routes>;
};

const RouteContext = createContext<string>('/');

const DerpRoute = ({ path, element }: { path: string; element: ReactNode }) => {
  return <RouteContext.Provider value={path}>{element}</RouteContext.Provider>;
};

export const Experiment = () => {
  return (
    <DerpRoutes>
      <DerpRoute path="/plugin1" element={<Plugin1 />} />
      <DerpRoute path="/my-plugin2" element={<Plugin2 />} />
    </DerpRoutes>
  );
};

class RouteRef {
  constructor(private path: string) {}

  override(newPath: string) {
    if (newPath !== this.path) {
      this.path = newPath;
    }
  }

  link(): string {
    return this.path;
  }
}

const mountPluginComponent = (routeRef: RouteRef, Component: ComponentType) => {
  return () => {
    const ctx = useContext(RouteContext);
    const contentHolder = useContext(ContentContext);
    routeRef.override(ctx);

    contentHolder.push(<Route path={ctx} element={<Component />} />);
    return null;
  };
};

const plugin1RouteRef = new RouteRef('/plugin1');
const plugin2RouteRef = new RouteRef('/plugin2');

const Plugin1 = mountPluginComponent(plugin1RouteRef, () => {
  return (
    <>
      <h1>Plugin1</h1>
      <a href={plugin2RouteRef.link()}>To Plugin2</a>
    </>
  );
});

const Plugin2 = mountPluginComponent(plugin2RouteRef, () => {
  return <h1>Plugin2</h1>;
});
