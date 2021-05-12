/* eslint-disable prefer-destructuring */
// import {} from './actions';

const initialState = {
    data: null,
    loading: true
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;
  }
}
