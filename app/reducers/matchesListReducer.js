import _ from 'underscore'

export default function matchesListReducer(state = initialState, action) {

  switch (action.type) {
    case 'RECEIVE_COUPLEREADY':
    case 'RECEIVE_DECOUPLE':
          return initialState;


    case 'REMOVE_MATCH':
          let matchId = action.payload.matchId;
          const newNewMatches = state.newMatches.reject(m => m.match_id == matchId)
            const newRegularMatches = state.matches.reject(m => m.match_id == matchId)
            return {matches: newRegularMatches, newMatches: newNewMatches }

    case 'GET_NEW_MATCHES_FULFILLED':
          if ( !action.payload.response ) return state;
          return {...state, newMatches: action.payload.response}


    case 'GET_MATCHES_FULFILLED':
          if ( !action.payload.response ) return state;
          return {...state, matches:  orderMatches( dedupe([...state.matches, ...action.payload.response]))}

    default:

          return state;
  }
}


const initialState = {
  newMatches: [],
  matches: []
};

function dedupe(matches){
  return _.uniq(matches,m => m.match_id)
}
function orderMatches( matches ) {
  const sortableMatches = matches;

  return sortableMatches.sort( function( a, b ) {
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
