
export default function unreadReducer(state = initialState, action) {

  switch (action.type) {


  case 'MARK_CHAT_READ':
    const newmState = {...state};
    newmState.realTotal = Math.ceil(state.realTotal - newmState[action.payload.match_id],0);
    newmState[action.payload.match_id] = 0;
    return newmState

  case 'HANDLE_NOTIFICATION_NEW_MATCH':
  case 'HANDLE_NOTIFICATION_NEW_MESSAGE':
    const newState = {...state};
    newState[action.payload.match_id] = (state[action.payload.match_id] ? parseInt(state[action.payload.match_id]) : 0) + 1;
    newState.realTotal = state.realTotal + 1;
    return newState;

  case 'GET_NOTIFICATION_COUNT_FULFILLED':

    return {...state, ...action.payload}

  default:

    return state;
  }
}


const initialState = {
  realTotal : 0
};
