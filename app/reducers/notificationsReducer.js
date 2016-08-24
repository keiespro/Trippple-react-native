
export default function notificationsReducer(state = initialState, action) {

  switch (action.type) {

    case 'RECEIVE_NOTIFICATION':

      return {...state, notifications: [...state.notifications, action.payload]}

    default:

      return state;
  }
}


const initialState = {
  notifications: []
};
