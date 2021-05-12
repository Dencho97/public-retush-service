import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { authReducer } from './pages/auth';
import { taskboardReducer } from './pages/taskboard';
import { tariffsReducer } from './pages/tariffs';

export default history => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  taskboard: taskboardReducer,
  tariffs: tariffsReducer
});
