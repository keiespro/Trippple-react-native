
export default function matchesReducer(state = initialState, action) {


  switch (action.type) {



    case 'GET_MATCHES_FULFILLED':
      const matches = action.payload.response;
      if ( !matches ) return state;


        const matchesHash = matches.reduce( ( acc, el, i ) => {
          acc[ el.match_id ] = el;
          return acc
        }, {})




        return {...state,...matchesHash}



    default:

      return state;
  }
}


const initialState = { };
