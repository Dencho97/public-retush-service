import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Typography,
    Skeleton,
    Icon,
    Badge
} from 'antd';

import { TARIFFS_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
// import {} from './actions';
import './style.scss';

class TariffsPage extends Component {
    componentDidMount() {
        // const { dispatch, auth } = this.props;
        // dispatch(getTasksAction(auth.token, auth.user));
    }

    static pathPage = TARIFFS_ROUTE;

    static namePage = 'Тарифы';

    render() {
        return '123';
    }
}

TariffsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tariffs: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    tariffs: state.tariffs
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperContent
);

export default wrapper(TariffsPage);
