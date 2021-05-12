/* eslint-disable prefer-destructuring */
import {
    DRAG_TASK,
    CHANGE_CURRENT_DRAG,
    REQUEST_GET_TASKS,
    RESPONSE_GET_TASKS,
    SWITCH_MODAL_TASK,
    REQUEST_EDIT_TASK,
    RESPONSE_EDIT_TASK,
    CHANGE_DRAGGING,
    sendChangePosTasksActionServer
} from './actions';

const initialState = {
    currentDragColumn: null,
    isDragging: false,
    modalCard: {
        data: null,
        open: false
    },
    data: null,
    loading: true
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_CURRENT_DRAG:
        return {
            ...state,
            currentDragColumn: payload
        };
    case DRAG_TASK: {
        const { columnID, dragResult, token } = payload;
        const { removedIndex, addedIndex, payload: payloadItem } = dragResult;
        if (removedIndex === null && addedIndex === null) return state;

        let newTasks = [...state.data.filter(column => column.id === columnID)[0].tasks];
        let itemToAdd = payloadItem;

        if (removedIndex !== null) {
            itemToAdd = newTasks.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
            newTasks.splice(addedIndex, 0, itemToAdd);
        }

        newTasks = newTasks.map((item, index) => {
            if (dragResult.removedIndex === null && dragResult.addedIndex !== null && payloadItem.id === item.id) { // перемещаем в колонку
                switch (state.currentDragColumn) {
                    case 'column-new':
                        return {
                            ...item,
                            pos: index,
                            status: 'new',
                            executor_id: null
                        };
                    case 'column-working':
                        return {
                            ...item,
                            pos: index,
                            status: 'working',
                        };
                    case 'column-end':
                        return {
                            ...item,
                            pos: index,
                            status: 'finished'
                        };
                    default: {
                        let execcutorID = state.currentDragColumn.split('-');
                        execcutorID = +execcutorID[1];
                        return {
                            ...item,
                            pos: index,
                            status: 'waiting_in_line',
                            executor_id: execcutorID
                        };
                    }
                }
            }
            if (dragResult.removedIndex !== null && dragResult.addedIndex === null && payloadItem.id === item.id) { // перемещаем из колонки
                switch (columnID) {
                    case 'column-new':
                        return {
                            ...item,
                            pos: index,
                            status: 'new',
                            executor_id: null
                        };
                    case 'column-working':
                        return {
                            ...item,
                            pos: index,
                            status: 'working',
                            executor_id: item.executor_id
                        };
                    case 'column-end':
                        return {
                            ...item,
                            pos: index,
                            status: 'finished',
                            executor_id: item.executor_id
                        };
                    default: {
                        let execcutorID = columnID.split('-');
                        execcutorID = +execcutorID[1];
                        return {
                            ...item,
                            pos: index,
                            status: 'waiting_in_line',
                            executor_id: execcutorID
                        };
                    }
                }
            }
            return {
                ...item,
                pos: index,
                status: item.status,
                execcutor_id: item.executor_id
            };
        });

        if (dragResult.removedIndex !== null && dragResult.addedIndex !== null && columnID === state.currentDragColumn) { // перемещаем внутри колонки
            sendChangePosTasksActionServer('insideColumn', newTasks, token);
        }

        if (dragResult.removedIndex === null && dragResult.addedIndex !== null && columnID === state.currentDragColumn) { // перемещаем в колонку
            let actionType = null;
            let execcutorID = null;

            switch (state.currentDragColumn) {
                case 'column-new':
                    actionType = 'moveToNewColumn';
                    break;
                case 'column-working':
                    actionType = 'moveToWorkingColumn';
                    break;
                case 'column-end':
                    actionType = 'moveToEndColumn';
                    break;
                default:
                    actionType = 'moveToExecutorColumn';
                    execcutorID = state.currentDragColumn.split('-');
                    execcutorID = +execcutorID[1];
                    break;
            }
            sendChangePosTasksActionServer(actionType, newTasks, token);
        }

        if (dragResult.removedIndex !== null && dragResult.addedIndex === null && columnID === state.currentDragColumn) { // перемещаем из колонки
            let actionType = null;
            let execcutorID = null;

            switch (columnID) {
                case 'column-new':
                    actionType = 'moveToNewColumn';
                    break;
                case 'column-working':
                    actionType = 'moveToWorkingColumn';
                    break;
                case 'column-end':
                    actionType = 'moveToEndColumn';
                    break;
                default:
                    actionType = 'moveToExecutorColumn';
                    execcutorID = columnID.split('-');
                    execcutorID = +execcutorID[1];
                    break;
            }
            sendChangePosTasksActionServer(actionType, newTasks, token);
        }

        return {
            ...state,
            data: state.data.map((column) => {
                if (column.id === columnID) {
                    return {
                        ...column,
                        tasks: newTasks
                    };
                }
                return column;
            })
        };
    }
    case REQUEST_GET_TASKS:
    case REQUEST_EDIT_TASK:
        return {
            ...state,
            loading: true
        };
    case RESPONSE_GET_TASKS: {
        if (typeof payload === 'object') {
            const { dataTasks, dataUsers, user } = payload;
            let columns = [];

            switch (user.role) {
                case 'manager': {
                    columns = [
                        {
                            id: 'column-new',
                            name: 'Необработанные',
                            tasks: dataTasks.data.filter((task) => {
                                if (task.status === 'new' && task.executor_id === null) return true;
                                return false;
                            })
                        },
                        {
                            id: 'column-end',
                            name: 'Завершенные',
                            tasks: dataTasks.data.filter((task) => {
                                if (task.status === 'finished') return true;
                                return false;
                            })
                        }
                    ];

                    dataUsers.data.forEach((item) => {
                        if (item.role === 'executor') {
                            const userColumn = {
                                id: `executor-${item.id}`,
                                name: item.email,
                                tasks: dataTasks.data.filter((task) => {
                                    if (task.executor_id === item.id && task.status !== 'finished') return true;
                                    return false;
                                })
                            };
                            columns = [...columns, userColumn];
                        }
                    });
                    break;
                }
                case 'executor': {
                    columns = [
                        {
                            id: `executor-${user.id}`,
                            name: 'Ожидают выполнения',
                            tasks: dataTasks.data.filter((task) => {
                                if (task.status === 'waiting_in_line' && task.executor_id === user.id) return true;
                                return false;
                            })
                        },
                        {
                            id: 'column-working',
                            name: 'В работе',
                            tasks: dataTasks.data.filter((task) => {
                                if (task.status === 'working' && task.executor_id === user.id) return true;
                                return false;
                            })
                        },
                        {
                            id: 'column-end',
                            name: 'Завершенные',
                            tasks: dataTasks.data.filter((task) => {
                                if (task.status === 'finished' && task.executor_id === user.id) return true;
                                return false;
                            })
                        }
                    ];
                    break;
                }
                default:
                    break;
            }

            return {
                ...state,
                loading: false,
                data: columns
            };
        }
        return {
            ...state,
            loading: false,
            data: payload
        };
    }
    case SWITCH_MODAL_TASK:
        return {
            ...state,
            modalCard: {
                ...state.modalCard,
                data: payload,
                active: !state.modalCard.active
            }
        };
    case RESPONSE_EDIT_TASK: {
        if (payload) {
            return {
                ...state,
                modalCard: {
                    ...state.modalCard,
                    data: {
                        ...state.modalCard.data,
                        ...payload
                    }
                },
                data: state.data.map(item => ({
                    ...item,
                    tasks: item.tasks.map((task) => {
                        if (+task.id === +payload.id) {
                            return {
                                ...task,
                                ...payload
                            };
                        }
                        return task;
                    })
                }))
            };
        }
        return state;
    }
    case CHANGE_DRAGGING: {
        if (payload === 'start') {
            return {
                ...state,
                isDragging: true
            };
        }
        if (payload === 'end') {
            return {
                ...state,
                isDragging: false
            };
        }
        return state;
    }
    default:
      return state;
  }
}
