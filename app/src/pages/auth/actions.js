import axios from 'axios';

import notification from '../../components/notification';

import { API_HOST } from '../../constans/api';
import { LOGIN_ROUTE } from '../../constans/routes';

export const UNSET_AUTH = 'UNSET_AUTH';
export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RESPONSE_AUTH = 'RESPONSE_AUTH';
//
export const REQUEST_REGISTRATION = 'REQUEST_REGISTRATION';
export const RESPONSE_REGISTRATION = 'RESPONSE_REGISTRATION';
export const REQUEST_CONFIRM_REGISTRATION = 'REQUEST_CONFIRM_REGISTRATION';
export const RESPONSE_CONFIRM_REGISTRATION = 'RESPONSE_CONFIRM_REGISTRATION';
//
export const REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD';
export const RESPONSE_RESET_PASSWORD = 'RESPONSE_RESET_PASSWORD';
export const REQUEST_CONFIRM_RESET_PASSWORD = 'REQUEST_CONFIRM_RESET_PASSWORD';
export const RESPONSE_CONFIRM_RESET_PASSWORD = 'RESPONSE_CONFIRM_RESET_PASSWORD';

export const checkAuthAction = token => (dispatch) => {
    dispatch({ type: REQUEST_AUTH });

    axios.get(`${API_HOST}v1/auth?token=${token}`)
    .then((response) => {
        const { data } = response;

        dispatch({
           type: RESPONSE_AUTH,
           payload: data
        });
    })
    .catch((error) => {
           dispatch({ type: RESPONSE_AUTH, payload: null });
           console.error(error);
    });
};

export const authAction = userdata => (dispatch) => {
    dispatch({ type: REQUEST_AUTH });

    const formData = new FormData();
    const sendData = {
        email: userdata.login,
        password: userdata.password
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

   axios.post(
        `${API_HOST}v1/auth`,
        formData
      )
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_AUTH,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_AUTH, payload: null });
            console.error(error);
      });
};

export const logOutAction = () => (dispatch) => {
    dispatch({ type: UNSET_AUTH });
};

export const registrationAction = userdata => (dispatch) => {
    dispatch({ type: REQUEST_REGISTRATION });

    const formData = new FormData();
    const sendData = {
        email: userdata.email,
        password: userdata.password
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}v1/registration`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_REGISTRATION,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_REGISTRATION, payload: null });
            console.error(error);
      });
};

export const confirmRegistrationAction = confirmCode => (dispatch) => {
    dispatch({ type: REQUEST_CONFIRM_REGISTRATION });

    const formData = new FormData();
    const sendData = {
        confirm_code: confirmCode
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}v1/registration/confirm`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_CONFIRM_REGISTRATION,
            payload: { error: +data.error }
        });
        if (!+data.error) {
            setTimeout(() => {
                window.location.replace(`${window.location.origin}${LOGIN_ROUTE}`);
            }, 3000);
        } else {
            notification('error', 'Ошибка', data.message);
        }
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_CONFIRM_REGISTRATION, payload: { error: 1 } });
            console.error(error);
      });
};

export const resetAction = email => (dispatch) => {
    dispatch({ type: REQUEST_RESET_PASSWORD });

    const formData = new FormData();
    const sendData = {
        email
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}users/reset`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_RESET_PASSWORD,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_RESET_PASSWORD, payload: null });
            console.error(error);
      });
};

export const confirmResetAction = resetCode => (dispatch) => {
    dispatch({ type: REQUEST_CONFIRM_RESET_PASSWORD });

    axios.get(`${API_HOST}users/reset?reset_code=${resetCode}`)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_CONFIRM_RESET_PASSWORD,
            payload: { error: +data.error }
        });
        if (!+data.error) {
            setTimeout(() => {
                window.location.replace(`${window.location.origin}${LOGIN_ROUTE}`);
            }, 3000);
            console.log('ok');
        } else {
            notification('error', 'Ошибка', data.message);
        }
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_CONFIRM_RESET_PASSWORD, payload: { error: 1 } });
            console.error(error);
      });
};
