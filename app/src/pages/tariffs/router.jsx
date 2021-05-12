import React from 'react';
import { TARIFFS_ROUTE } from '../../constans/routes';
import TariffsPage from './tariffs';
import PrivateRouter from '../../components/PrivateRouter';

export default [
  <PrivateRouter key={TARIFFS_ROUTE} component={TariffsPage} exact path={TARIFFS_ROUTE} />,
];
