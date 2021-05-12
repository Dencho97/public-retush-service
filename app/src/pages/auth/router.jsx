import React from 'react';
import { Route } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, RESET_PASSWORD_ROUTE } from '../../constans/routes';
import LoginPage from './login';
import RegistrationPage from './registration';
import ResetPasswordPage from './reset-password';

export default [
  <Route key={LOGIN_ROUTE} component={LoginPage} exact path={LOGIN_ROUTE} />,
  <Route key={REGISTRATION_ROUTE} component={RegistrationPage} exact path={REGISTRATION_ROUTE} />,
  <Route key={RESET_PASSWORD_ROUTE} component={ResetPasswordPage} exact path={RESET_PASSWORD_ROUTE} />,
];
