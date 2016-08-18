
export default function newMatchesReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_NEW_MATCHES_FULFILLED':
      if ( !action.payload ) return state;
      return {...state, ...(action.payload.response.reduce( ( acc, el, i ) => {
        acc[ el.match_id ] = el;
        return acc
      }, {}))}


    case 'GET_MATCHES_FULFILLED':
      if ( !action.payload  ) return state;

      const matches = action.payload.response
      if (  !matches ) return state;
      const match_ids = matches.reduce( ( acc, el, i ) => {
        acc[ el.match_id ] = true;
        return acc
      }, {})

        const newMatchesHash = Object.keys(state).reduce( ( acc, el, i ) => {
          if(!match_ids[el]){
            acc[ el ] = state[el];
          }
          return acc
        }, {})

        return {...newMatchesHash}


    default:

      return state;
  }
}


const initialState = { };
