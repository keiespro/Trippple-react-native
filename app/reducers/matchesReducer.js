
export default function matchesReducer(state = initialState, action) {


  switch (action.type) {

    case 'handleGetNewMatches':
      // if ( !matchesData ) return state;
      console.log(action.payload.response.matchesData.matches);
      return {...state, ...(action.payload.response.matchesData.matches.reduce( ( acc, el, i ) => {
        acc[ el.match_id ] = el;
        return acc
      }, {}))}


    case 'handleGetMatches':

      if ( !matchesData ) return state;
      const {matches} = matchesData


        const matchesHash = matches.reduce( ( acc, el, i ) => {
          acc[ el.match_id ] = el;
          return acc
        }, {})




        return orderMatches({...state,...matchesHash});



    default:

      return state;
  }
}


const initialState = { };


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


function orderNewMatches( matches ) {
  const sortableMatches = matches;
  return sortableMatches.sort( function( a, b ) {
    const aTime = a.match_id
    const bTime = b.match_id
    if ( aTime < bTime ) {
      return 1;
    } else if ( aTime >= bTime ) {
      return -1;
    }
    return 0;
  });
}
