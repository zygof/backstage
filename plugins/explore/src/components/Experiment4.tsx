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

import React, { Component, createContext, useContext } from 'react';

export const Experiment = () => {
  return (
    <>
      <Level1A />
      <Level1B />
    </>
  );
};

const WeGooodContext = createContext<boolean>(false);

class Boundary extends Component {
  static getDerivedStateFromError(error: Error) {
    console.log('DEBUG:getDerivedStateFromError error =', error);
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(error: Error) {
    console.log('DEBUG:componentDidCatch error =', error);
  }

  render() {
    return (
      <WeGooodContext.Provider value={!this.state.hasError}>
        {this.props.children}
      </WeGooodContext.Provider>
    );
  }
}

const usePrerender = callback => {
  const weGood = useContext(WeGooodContext);
  if (!weGood) {
    callback();
  }
};

const Level1A = () => {
  usePrerender(() => {
    throw 'derp';
  });

  return (
    <>
      <h1>Level1A</h1>
      <Boundary>
        <Level2 />
      </Boundary>
    </>
  );
};

const Level1B = () => {
  usePrerender(() => {
    throw 'derp';
  });

  return (
    <>
      <h1>Level1B</h1>
      <Boundary>
        <Level2 />
      </Boundary>
    </>
  );
};

const Level2 = () => {
  return (
    <>
      <h1>Level2</h1>
    </>
  );
};
