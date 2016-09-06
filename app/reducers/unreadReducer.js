
export default function unreadReducer(state = initialState, action) {

  switch (action.type) {
      case 'MARK_CHAT_READ':
        const newmState = {...state}
        newmState.realTotal = Math.ceil(state.realTotal - newmState[action.payload.match_id],0);
        newmState[action.payload.match_id] = 0;
        return newmState

      case 'RECEIVE_NOTIFICATION_FULFILLED':
        const newState = {...state}
        if(action.payload.label == 'NewMessage'){
          newState[action.payload.match_id] = (state[action.payload.match_id] ? parseInt(state[action.payload.match_id]) : 0) + 1
          newState.realTotal = state.realTotal + 1
        }
        return newState


      case 'GET_NOTIFICATION_COUNT_FULFILLED':

        console.log(action.payload);
        return {...state, ...action.payload}

      default:

        return state;
  }
}


const initialState = {
  realTotal : 0
};
