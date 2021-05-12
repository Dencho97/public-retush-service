import axios from 'axios';

import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

export const DRAG_TASK = 'DRAG_TASK';
export const CHANGE_DRAGGING = 'CHANGE_DRAGGING';
export const CHANGE_CURRENT_DRAG = 'CHANGE_CURRENT_DRAG';
export const REQUEST_GET_TASKS = 'REQUEST_GET_TASKS';
export const RESPONSE_GET_TASKS = 'RESPONSE_GET_TASKS';
export const SWITCH_MODAL_TASK = 'SWITCH_MODAL_TASK';
export const REQUEST_EDIT_TASK = 'REQUEST_EDIT_TASK';
export const RESPONSE_EDIT_TASK = 'RESPONSE_EDIT_TASK';

export const sendChangePosTasksActionServer = (type, tasks, token) => {
    const newTasks = tasks.map(task => ({
        id: task.id,
        pos: task.pos,
        status: task.status,
        executor_id: task.executor_id
    }));

    const formData = new FormData();
    const sendData = {
        type,
        tasks: newTasks,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}v1/tasks/move`, sendData)
    .then((response) => {
        const { data } = response;
        if (+data.error) {
            notification('error', data.message);
        }
    })
    .catch((error) => {
        notification('error', 'Произошла ошибка');
        console.error(error);
    });
};

export const switchModalTaskAction = task => (dispatch) => {
    dispatch({ type: SWITCH_MODAL_TASK, payload: task });
};

export const changeCurrentDragAction = columnID => (dispatch) => {
    dispatch({ type: CHANGE_CURRENT_DRAG, payload: columnID });
};

export const onDragTaskAction = (columnID, dragResult, token) => (dispatch) => {
    dispatch({ type: DRAG_TASK, payload: { columnID, dragResult, token } });
};

export const getTasksAction = (token, user) => (dispatch) => {
    dispatch({ type: REQUEST_GET_TASKS });

    const requestTasks = axios.get(`${API_HOST}v1/tasks?token=${token}`);
    const requestUsers = axios.get(`${API_HOST}v1/users?token=${token}`);

    axios.all([requestTasks, requestUsers])
    .then(axios.spread((...responses) => {
        const responseTasks = responses[0];
        const responseUsers = responses[1];
        const { data: dataTasks } = responseTasks;
        const { data: dataUsers } = responseUsers;

        if (!+dataTasks.error || !+dataUsers.error) {
            dispatch({
                type: RESPONSE_GET_TASKS,
                payload: {
                    dataTasks,
                    dataUsers,
                    user
                }
            });
        } else {
            dispatch({
                type: RESPONSE_GET_TASKS,
                payload: []
            });

            if (+dataTasks.error) {
                notification('error', dataTasks.message);
            }
            if (+dataUsers.error) {
                notification('error', dataUsers.message);
            }
        }
      }))
    .catch((error) => {
        dispatch({
            type: RESPONSE_GET_TASKS,
            payload: []
        });
           console.error(error);
    });
};

export const editTaskAction = (type, userdata, token) => (dispatch) => {
    dispatch({ type: REQUEST_EDIT_TASK });

    const formData = new FormData();
    const sendData = {
        type,
        ...userdata,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}v1/tasks/edit`, sendData)
    .then((response) => {
        const { data } = response;
        if (+data.error) {
            notification('error', data.message);
        }
        dispatch({ type: RESPONSE_EDIT_TASK, payload: userdata });
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_EDIT_TASK, payload: null });
        notification('error', 'Произошла ошибка');
        console.error(error);
    });
};

export const draggingTaskAction = type => (dispatch) => {
    dispatch({ type: CHANGE_DRAGGING, payload: type });
};
