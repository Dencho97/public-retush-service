import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const WrapperAuth = (Component) => {
    class WrapperAuthChild extends React.PureComponent {
        static pathPage = Component.pathPage;

        static namePage = Component.namePage;

        render() {
            document.title = `${Component.namePage}`;

            return (
                <section className="auth wrapper">
                    <Component {...this.props} />
                </section>
            );
        }
    }

    const mapStateToProps = state => ({
        settings: state.settings
    });

    return connect(mapStateToProps)(WrapperAuthChild);
};

export default WrapperAuth;
