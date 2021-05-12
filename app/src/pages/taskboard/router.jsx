import React from 'react';
import { TASKBOARD_ROUTE } from '../../constans/routes';
import TaskBoardPage from './taskboard';
import PrivateRouter from '../../components/PrivateRouter';

export default [
  <PrivateRouter key={TASKBOARD_ROUTE} component={TaskBoardPage} access={['manager', 'executor']} exact path={TASKBOARD_ROUTE} />,
];
