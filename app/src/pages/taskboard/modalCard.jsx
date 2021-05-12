import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Modal,
    Icon,
    Badge,
    Typography
} from 'antd';
import moment from 'moment';

import { switchModalTaskAction, editTaskAction } from './actions';
import IconTitle from '../../assets/title.svg';
import IconDesc from '../../assets/description.svg';
import IconAttach from '../../assets/attach.svg';
import IconTime from '../../assets/time.svg';
import IconEye from '../../assets/eye.svg';
import './style.scss';

const { Paragraph } = Typography;

class ModalCard extends Component {
    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchModalTaskAction(null));
    }

    onChangeDesc = (id, str) => {
        const { dispatch, auth } = this.props;
        dispatch(editTaskAction('editDescription', { id, description: str }, auth.token));
    }

    render() {
        const { taskboard } = this.props;
        const { modalCard } = taskboard;
        const { data } = modalCard;

        return (
            <Modal
                title={data ? (
                    <>
                        <Icon component={IconTitle} className="modal-card_title-icon" />
                        <p className="modal-card_title">{data.name}</p>
                    </>
                ) : ''}
                centered
                visible={modalCard.active}
                className="modal-card"
                footer={null}
                onCancel={() => this.onClose()}
                closeIcon={<Icon type="close-circle" />}
            >
                {data ? (
                    <>
                        <div className="modal-card__item">
                            <div className="modal-card__item__head">
                                <Icon component={IconDesc} className="modal-card__item__head_icon" />
                                <span className="modal-card__item__head_name">Описание</span>
                            </div>
                            <Paragraph className="modal-card__item_content" editable={{ onChange: str => this.onChangeDesc(data.id, str) }}>{data.description}</Paragraph>
                        </div>
                        <div className="modal-card__item">
                            <div className="modal-card__item__head">
                                <Icon component={IconAttach} className="modal-card__item__head_icon" />
                                <span className="modal-card__item__head_name">Вложения</span>
                            </div>
                            <a href={data.link} className="modal-card__item_content">
                                <Icon type="download" />
                                &nbsp;Скачать
                            </a>
                        </div>
                        <div className="modal-card__item">
                            <div className="modal-card__item__head">
                                <Icon component={IconTime} className="modal-card__item__head_icon" />
                                <span className="modal-card__item__head_name">Срок</span>
                            </div>
                            <p className="modal-card__item_content">{moment(data.deadline).format('DD.MM.YYYY')}</p>
                        </div>
                        <div className="modal-card__item">
                            <div className="modal-card__item__head">
                                <Icon component={IconEye} className="modal-card__item__head_icon" />
                                <span className="modal-card__item__head_name">Статус</span>
                            </div>
                            <div className="modal-card__item_content">
                                {data.status === 'new' ? <Badge status="error" text="Новый" /> : null}
                                {data.status === 'waiting_in_line' ? <Badge status="warning" text="Назначен исполнителю" /> : null}
                                {data.status === 'working' ? <Badge status="processing" text="В работе" /> : null}
                                {data.status === 'finished' ? <Badge status="success" text="Завершен" /> : null}
                            </div>
                        </div>
                    </>
                ) : null}
            </Modal>
        );
    }
}

ModalCard.propTypes = {
    dispatch: PropTypes.func.isRequired,
    taskboard: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    taskboard: state.taskboard
});

export default connect(mapStateToProps)(ModalCard);
