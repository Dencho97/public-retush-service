import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';

import { TASKBOARD_ROUTE } from './constans/routes';

import { authRouter } from './pages/auth';
import { taskboardRouter } from './pages/taskboard';
import { tariffsRouter } from './pages/tariffs';
import { forbiddenRouter } from './pages/forbidden';
import { notFoundRouter } from './pages/404';


export default (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/">
        <Redirect to={TASKBOARD_ROUTE} />
      </Route>
      { authRouter }
      { taskboardRouter }
      { tariffsRouter }
      { forbiddenRouter }
      { notFoundRouter }
      <Redirect to="/404" />
    </Switch>
  </ConnectedRouter>
);
