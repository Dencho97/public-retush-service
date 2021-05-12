import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  FORBIDDEN_ROUTE,
  LOGIN_ROUTE,
  TARIFFS_ROUTE
} from '../constans/routes';
import { checkAuthAction } from '../pages/auth/actions';
import Preloader from './Preloader';

class PrivateRoute extends React.PureComponent {
  componentDidMount() {
    const { auth } = this.props;
    const { token } = auth;
    if (token && !auth.authorized) {
        const { dispatch } = this.props;
        dispatch(checkAuthAction(token));
    }
}

  render() {
    const {
      component: Component,
      auth,
      access,
      ...rest
    } = this.props;
    const { user } = auth;

    if (auth.token === null) {
      return (<Redirect to={LOGIN_ROUTE} />);
    }

    if (!auth.authorized || auth.loading) {
      return <Preloader />;
    }

    return (
      <Route
        {...rest}
        render={(props) => {
            if (auth.authorized) {
              if (access.length) {
                if (access.includes(user.role)) {
                  return <Component {...props} />;
                }

                return <Redirect to={TARIFFS_ROUTE} />;
              }

              return <Component {...props} />;
            }

            return <Redirect to={FORBIDDEN_ROUTE} />;
          }
        }
      />
    );
  }
}

PrivateRoute.defaultProps = {
  access: []
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    access: PropTypes.array,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
