import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Layout,
    Menu,
    Avatar,
    Tag,
    Icon,
    Dropdown
} from 'antd';

import {
    TASKBOARD_ROUTE,
    TARIFFS_ROUTE
} from '../constans/routes';
import { logOutAction } from '../pages/auth/actions';
import BoardSvg from '../assets/board.svg';
import TariffSvg from '../assets/tariff.svg';
import HistorySvg from '../assets/history.svg';

const { Header, Content, Footer } = Layout;

const WrapperContent = (Component) => {
    class WrapperContentChild extends React.PureComponent {
        onLogout = () => {
            const { dispatch } = this.props;

            dispatch(logOutAction());
        }

        static namePage = Component.namePage;

        static pathPage = Component.pathPage;

        render() {
            document.title = `${Component.namePage}`;

            const { auth } = this.props;
            const { user } = auth;

            return (
                <section className="app wrapper">
                    <Layout className="app layout">
                        <Header className="header">
                            <div className="header_logo" />
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                className="header__menu"
                                selectedKeys={[Component.pathPage]}
                            >
                                {['executor', 'manager'].includes(user.role) ? (
                                    <Menu.Item key={TASKBOARD_ROUTE}>
                                        <Icon component={BoardSvg} />
                                        Доска заказов
                                    </Menu.Item>
                                ) : null}
                                {['client'].includes(user.role) ? ([
                                    <Menu.Item key={TARIFFS_ROUTE}>
                                        <Icon component={TariffSvg} />
                                        Тарифы
                                    </Menu.Item>,
                                    <Menu.Item key="history">
                                        <Icon component={HistorySvg} />
                                        История заказов
                                    </Menu.Item>
                                ]) : null}
                            </Menu>
                            <div className="header__right">
                                {!user.active ? <Tag className="header__right_status-email">E-mail не подтверждён</Tag> : null}
                                <Dropdown overlay={() => (
                                        <Menu>
                                            <Menu.Item onClick={() => this.onLogout()}>
                                                <Icon type="poweroff" />
                                                &nbsp;Выйти
                                            </Menu.Item>
                                        </Menu>
                                    )}
                                >
                                    <Avatar size="large" className="header__right_avatar">{user.email.slice(0, 2).toUpperCase()}</Avatar>
                                </Dropdown>
                            </div>
                        </Header>
                        <Content className="app content">
                            <Component {...this.props} />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>RETUSH 2021</Footer>
                    </Layout>
                </section>
            );
        }
    }

    WrapperContentChild.propTypes = {
        dispatch: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired
    };

    const mapStateToProps = state => ({
        auth: state.auth
    });

    return connect(mapStateToProps)(WrapperContentChild);
};

export default WrapperContent;
