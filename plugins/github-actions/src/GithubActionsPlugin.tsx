import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorkflowRunsPage } from './components/WorkflowRunsPage';
import { WorkflowRunDetailsPage } from './components/WorkflowRunDetailsPage';
import { buildRouteRef, rootRouteRef, projectRouteRef } from './plugin';

const BackstageRoute = ({ children, route, ...props }) => (
  <Route {...props} path={route.path} element={children} />
);

export const Plugin = (
  <>
    <Route path={rootRouteRef.path} element={<WorkflowRunsPage />}></Route>
    <Route
      path={buildRouteRef.path}
      element={<WorkflowRunDetailsPage />}
    ></Route>
  </>
);
