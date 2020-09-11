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

import React, { useEffect } from 'react';
import {
  useParams,
  useLocation,
  useNavigate,
  Routes,
  Route,
} from 'react-router';

// http://localhost:3000/homepage
// http://localhost:3000/catalog/a/dafuq/?subroute=status
// http://localhost:3000/catalog/a/dafuq/status

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Experiment = () => {
  return (
    <Routes>
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/catalog/a/*" element={<EntityPage />} />
    </Routes>
  );
};

const HomePage = () => {
  return (
    <div>
      <h3>
        <a href="/catalog/a">EntityPage</a>
      </h3>
      <h3>
        <a href="/catalog/a?subroute=status">StatusComponent</a>
      </h3>
      <h3>
        <a href="/catalog/a/api-status">StatusComponent</a>
      </h3>
    </div>
  );
};

const routeMap: { [key: string]: string } = {
  status: './status',
};

const EntityPage = () => {
  const params = useParams();
  const query = useQuery();
  const subroute = query.get('subroute');
  const navigate = useNavigate();

  useEffect(() => {
    if (subroute && subroute in routeMap) {
      navigate(routeMap[subroute]);
    }
  }, [subroute, navigate]);

  return (
    <>
      <h3>
        <a href="/homepage">Home</a>
      </h3>
      <Routes>
        {/* {subroute && subroute in routeMap && (
          <Navigate to={routeMap[subroute]} />
        )} */}
        <Route path="/api-status" element={<StatusComponent />} />
      </Routes>
      <pre>params: {JSON.stringify(params, null, 2)}</pre>
      <pre>query: {JSON.stringify(query, null, 2)}</pre>
    </>
  );
};

const StatusComponent = () => {
  return <h1>Another component right here</h1>;
};
