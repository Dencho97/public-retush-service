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
import { Container, Draggable } from 'react-smooth-dnd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import { TASKBOARD_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import ModalCard from './modalCard';
import IconTime from '../../assets/time.svg';
import IconEye from '../../assets/eye.svg';
import {
    onDragTaskAction,
    getTasksAction,
    changeCurrentDragAction,
    switchModalTaskAction,
    draggingTaskAction
} from './actions';
import './style.scss';

const { Title } = Typography;

let updateInterval = null;

class TaskBoardPage extends Component {
    componentDidMount() {
        const { dispatch, auth } = this.props;
        dispatch(getTasksAction(auth.token, auth.user));

        updateInterval = setInterval(() => {
            dispatch(getTasksAction(auth.token, auth.user));
        }, 5000);
    }

    componentDidUpdate() {
        window.onmousemove = (e) => {
            const { taskboard } = this.props;
            const { isDragging } = taskboard;

            if (isDragging) {
                const pageWidth = window.innerWidth;
                const edges = [pageWidth / 15, pageWidth - (pageWidth / 15)];
                if (e.pageX >= edges[1]) {
                    const scrollbar = document.getElementsByClassName('board__scroll_view')[0];
                    scrollbar.scrollLeft += 20;
                }
                if (e.pageX <= edges[0]) {
                    const scrollbar = document.getElementsByClassName('board__scroll_view')[0];
                    scrollbar.scrollLeft -= 20;
                }
            }
        };
    }

    componentWillUnmount() {
        clearInterval(updateInterval);
    }

    getCardPayload = (columnID, index) => {
        const { taskboard } = this.props;
        const { data: columns } = taskboard;
        const item = columns.filter(col => col.id === columnID)[0].tasks[index];

        return item;
    }

    onChangeCurrentColumnDrag = (columnID) => {
        const { dispatch } = this.props;
        dispatch(changeCurrentDragAction(columnID));
    }

    onDrop = (columnID, result) => {
        const { dispatch, auth } = this.props;

        if (result.removedIndex !== null || result.addedIndex !== null) {
            dispatch(onDragTaskAction(columnID, result, auth.token));
        }
    }

    onDragging = (params, type) => {
        if (params.isSource) {
            const { dispatch } = this.props;
            dispatch(draggingTaskAction(type));
        }
    }

    sortTasks = (a, b) => {
        if (a.pos > b.pos) {
            return 1;
        }
        if (a.pos < b.pos) {
            return -1;
        }
        return 0;
    }

    openModal = (task) => {
        const { dispatch } = this.props;
        dispatch(switchModalTaskAction(task));
    }

    static pathPage = TASKBOARD_ROUTE;

    static namePage = 'Главная';

    render() {
        const { taskboard, auth } = this.props;
        const { user } = auth;

        if (taskboard.loading && taskboard.data === null) {
            return (
                <section className="main page">
                    <div className="board">
                        {[1, 2, 3, 4].map(indexColumn => (
                            <div className="board__column" key={indexColumn}>
                                <Skeleton active paragraph={{ rows: 0 }} />
                                <div className="board__column__tasks">
                                    {[1, 2, 3].map(indexTask => (
                                        <div className="board__column__tasks__task" key={indexTask}>
                                            <span className="board__column__tasks__task_name">
                                                <Skeleton active paragraph={{ rows: 2 }} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            );
        }

        switch (user.role) {
            case 'manager': {
                return (
                    <section className="main page">
                        <div className="board">
                            <Scrollbars
                                className="board__scroll"
                                renderView={props => (<div className="board__scroll_view" {...props} />)}
                                renderTrackHorizontal={props => (<div className="board__scroll__horizontal" {...props} />)}
                                renderThumbHorizontal={props => (<div className="board__scroll__horizontal_thumb" {...props} />)}
                            >
                                {taskboard.data.map(column => (
                                    <div className="board__column" key={column.id}>
                                        <Title level={4} className="board__column_name">{column.name}</Title>
                                        <div className="board__column__tasks">
                                            <Container
                                                groupName="col"
                                                onDragEnter={() => this.onChangeCurrentColumnDrag(column.id)}
                                                onDrop={result => this.onDrop(column.id, result)}
                                                getChildPayload={index => this.getCardPayload(column.id, index)}
                                                onDragStart={params => this.onDragging(params, 'start')}
                                                onDragEnd={params => this.onDragging(params, 'end')}
                                            >
                                                {column.tasks.sort(this.sortTasks).map(task => (
                                                    <Draggable key={task.id}>
                                                        <button type="button" onClick={() => this.openModal(task)} className="board__column__tasks__task" key={task.id}>
                                                            <span className="board__column__tasks__task_name">{task.name}</span>
                                                            <span className="board__column__tasks__task_time">
                                                                <Icon component={IconTime} />
                                                                {moment(task.deadline).format('DD.MM.YYYY')}
                                                            </span>
                                                            <span className="board__column__tasks__task_status">
                                                                <Icon component={IconEye} />
                                                                {task.status === 'new' ? <Badge status="error" text="Новый" /> : null}
                                                                {task.status === 'waiting_in_line' ? <Badge status="warning" text="Назначен исполнителю" /> : null}
                                                                {task.status === 'working' ? <Badge status="processing" text="В работе" /> : null}
                                                                {task.status === 'finished' ? <Badge status="success" text="Завершен" /> : null}
                                                            </span>
                                                        </button>
                                                    </Draggable>
                                                ))}
                                            </Container>
                                        </div>
                                    </div>
                                ))}
                            </Scrollbars>
                        </div>
                        <ModalCard />
                    </section>
                );
            }
            case 'executor': {
                return (
                    <section className="main page">
                        <div className="board">
                            <Scrollbars
                                className="board__scroll"
                                renderView={props => (<div className="board__scroll_view" {...props} />)}
                                renderTrackHorizontal={props => (<div className="board__scroll__horizontal" {...props} />)}
                                renderThumbHorizontal={props => (<div className="board__scroll__horizontal_thumb" {...props} />)}
                            >
                                {taskboard.data.map(column => (
                                    <div className="board__column" key={column.id}>
                                        <Title level={4} className="board__column_name">{column.name}</Title>
                                        <div className="board__column__tasks">
                                            <Container
                                                groupName="col"
                                                onDragEnter={() => this.onChangeCurrentColumnDrag(column.id)}
                                                onDrop={result => this.onDrop(column.id, result)}
                                                getChildPayload={index => this.getCardPayload(column.id, index)}
                                                onDragStart={params => this.onDragging(params, 'start')}
                                                onDragEnd={params => this.onDragging(params, 'end')}
                                            >
                                                {column.tasks.sort(this.sortTasks).map(task => (
                                                    <Draggable key={task.id}>
                                                        <button type="button" onClick={() => this.openModal(task)} className="board__column__tasks__task" key={task.id}>
                                                            <span className="board__column__tasks__task_name">{task.name}</span>
                                                            <span className="board__column__tasks__task_time">
                                                                <Icon component={IconTime} />
                                                                {moment(task.deadline).format('DD.MM.YYYY')}
                                                            </span>
                                                            <span className="board__column__tasks__task_status">
                                                                <Icon component={IconEye} />
                                                                {task.status === 'waiting_in_line' ? <Badge status="error" text="Новый" /> : null}
                                                                {task.status === 'working' ? <Badge status="processing" text="В работе" /> : null}
                                                                {task.status === 'finished' ? <Badge status="success" text="Завершен" /> : null}
                                                            </span>
                                                        </button>
                                                    </Draggable>
                                                ))}
                                            </Container>
                                        </div>
                                    </div>
                                ))}
                            </Scrollbars>
                        </div>
                        <ModalCard />
                    </section>
                );
            }
            default:
                return null;
        }
    }
}

TaskBoardPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    taskboard: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    taskboard: state.taskboard
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperContent
);

export default wrapper(TaskBoardPage);
