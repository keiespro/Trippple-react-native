
export default function unreadReducer(state = initialState, action) {

  switch (action.type) {
    case 'GET_NOTIFICATION_COUNT_FULFILLED':

      console.log(action.payload);
      return {...state, ...action.payload}

    default:

      return state;
  }
}


const initialState = {
  total : 0
};
