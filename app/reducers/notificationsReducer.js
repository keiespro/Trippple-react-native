
export default function notificationsReducer(state = initialState, action) {

  switch (action.type) {

  case 'CLEAR_ALL_NOTIFICATIONS':
    return initialState;
  case 'RECEIVE_NOTIFICATION_FULFILLED':
    console.log('xxx',action);
    return [...state, action.payload]

  default:

    return state;
  }
}


const initialState = [];
