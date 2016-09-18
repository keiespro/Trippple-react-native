import _ from 'lodash'

export default function matchesListReducer(state = initialState, action) {

  switch (action.type) {
  case 'ONBOARD_FULFILLED':
  case 'VERIFY_COUPLE_PIN_FULFILLED':
  case 'HANDLE_NOTIFICATION_COUPLE_READY':
  case 'HANDLE_NOTIFICATION_DECOUPLE':

    return initialState;


  case 'REMOVE_MATCH':
    const matchId = action.payload.matchId || action.payload.match_id;
    const newNewMatches = state.newMatches.reject(m => m.match_id == matchId)
    const newRegularMatches = state.matches.reject(m => m.match_id == matchId)
    return {matches: newRegularMatches, newMatches: newNewMatches }

  case 'GET_NEW_MATCHES_FULFILLED':
    if( !action.payload.response ) return state;
    return {...state, newMatches: action.payload.response}


  case 'GET_MATCHES_FULFILLED':

    if( !action.payload.response ) return state;

    const mtchs = state.matches.length > 1 ? dedupe([...state.matches, ...action.payload.response]) : action.payload.response;
    return {
      newMatches: _.difference(state.newMatches, action.payload.response),
      matches: mtchs.length > 1 ? orderMatches(mtchs) : mtchs
    };

  // 
  // case 'GET_MESSAGES_FULFILLED':
  //   console.warn('messages',action.payload.response);
  //   if( !action.payload.response ) return state;
  //
  //   const ma = state.matches[action.payload.response.match_id];
  //   ma.recent_message = action.payload
  //   return {
  //     newMatches: _.difference(state.newMatches, action.payload.response),
  //     matches: mtchs.length > 1 ? orderMatches(mtchs) : mtchs
  //   };
  //

  default:

    return {...state};
  }
}


const initialState = {
  newMatches: [],
  matches: []
};

function dedupe(matches){
  return _.uniqBy(matches, m => m.match_id)
}

function orderMatches( matches ) {
  const sortableMatches = matches;

  return sortableMatches.sort( ( a, b ) => {
    const aTime = a.recent_message && a.recent_message.created_timestamp
    const bTime = b.recent_message && b.recent_message.created_timestamp
    if ( aTime < bTime ) {
      return 1;
    } else if ( aTime >= bTime ) {
      return -1;
    }
    return 0;
  });

}
