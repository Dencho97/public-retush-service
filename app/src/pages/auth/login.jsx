import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Form,
    Icon,
    Input,
    Button,
    Typography
} from 'antd';
import { Redirect, Link } from 'react-router-dom';

import {
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    RESET_PASSWORD_ROUTE,
    TASKBOARD_ROUTE,
    TARIFFS_ROUTE
} from '../../constans/routes';
import WrapperAuth from '../../components/WrapperAuth';
import { authAction } from './actions';
import './style.scss';

const { Text } = Typography;

class LoginPage extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(authAction(values));
            }
        });
    };

    static pathPage = LOGIN_ROUTE;

    static namePage = 'Вход';

    render() {
        const { form, auth } = this.props;
        const { getFieldDecorator } = form;

        if (auth.token) {
            switch (auth.user.role) {
                case 'executor':
                case 'manager':
                    return <Redirect to={TASKBOARD_ROUTE} />;
                default:
                    return <Redirect to={TARIFFS_ROUTE} />;
            }
        }

        return (
            <section className="auth">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('login', {
                            rules: [{ required: true, message: 'Заполните поле!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="E-mail"
                                readOnly
                                onFocus={e => e.target.removeAttribute('readonly')}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Заполните поле!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Пароль"
                                readOnly
                                onFocus={e => e.target.removeAttribute('readonly')}
                            />,
                        )}
                    </Form.Item>
                    <div className="auth_reset-wrap">
                        <Link to={RESET_PASSWORD_ROUTE}>Забыли пароль?</Link>
                    </div>
                    { auth.error !== '' ? <Text type="danger" style={{ margin: '-14px 0 14px 0', display: 'block', lineHeight: 1.3 }}>{auth.error}</Text> : null }
                    <Button type="primary" htmlType="submit" loading={auth.loading} className="form-button">Войти</Button>
                    <p className="auth_or">или</p>
                    <Button type="primary" className="form-button"><Link to={REGISTRATION_ROUTE}>Зарегистрироваться</Link></Button>
                </Form>
            </section>
        );
    }
}

LoginPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    ws: state.ws,
    settings: state.settings
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperAuth
);

export default wrapper(LoginPage);
