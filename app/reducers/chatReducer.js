
export default function chatReducer(state = initialState, action) {

  switch (action.type) {
    // case 'CREATE_MESSAGE_PENDING':
    case 'CREATE_MESSAGE_FULFILLED':
      let match_id = action.payload.response.match_id
      return {...state, [match_id]: [...state[match_id], ] }
    case 'GET_MESSAGES_FULFILLED':
      return {
        ...state,
        [action.payload.response.match_id]: action.payload.response.message_thread
      }
    case 'GET_NEW_MATCHES_FULFILLED':
    case 'GET_MATCHES_FULFILLED':
      const ids = action.payload.response.reduce((acc,el,i)=>{
        acc[el.match_id] = [];
        return acc
      },{})
      return {...ids , ...state}

    default:

      return state;
  }
}


const initialState = {

};
