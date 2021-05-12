import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

import { NOT_FOUND_ROUTE } from '../../constans/routes';
import './style.scss';

class ForbiddenPage extends Component {
    componentDidMount() {
        document.title = 'Страница не найдена | ВедёмПриём';
    }

    static pathPage = NOT_FOUND_ROUTE;

    static namePage = 'Страница не найдена';

    render() {
        return (
            <section className="not-found page">
                <Result
                    status="404"
                    title="404"
                    subTitle="Страница не найдена."
                    extra={<Button type="primary"><Link to="/">Вернуться на галвную</Link></Button>}
                />
            </section>
        );
    }
}


const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ForbiddenPage);
