
export default function chatReducer(state = initialState, action) {
  switch (action.type) {
      case 'CREATE_MESSAGE_PENDING':
        if(!action.meta) return state
        let match_idd = action.meta[1]
        let msg = action.meta[0]
        let msgpayload = {
          created_timestamp: action.meta[2],
          message_body: msg,
          from_user_info: {
            name: 'You',
            id: global.creds.user_id,
            match_id: match_idd
          },
          ephemeral: true,
          matchId: match_idd,
          id:  action.meta[2]
        }

        return {...state, [match_idd]: [ ...state[match_idd], msgpayload ] }

      case 'CREATE_MESSAGE_REJECTED':
      // let match_id = action.payload.response.match_id
      // return {...state, [match_id]: [...state[match_id], ] }
        return state

      case 'CREATE_MESSAGE_FULFILLED':
        let match_id = action.payload.response.match_id;
        if ( !action.payload.response ) return state;
        return {...state, [match_id]: [...state[match_id]] }

      case 'GET_MESSAGES_FULFILLED':
        if ( !action.payload.response ) return state;
        return {
          ...state,
          [action.payload.response.match_id]: action.payload.response.message_thread
        }
      case 'GET_NEW_MATCHES_FULFILLED':
      case 'GET_MATCHES_FULFILLED':
        if ( !action.payload.response ) return state;

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
