import _ from 'lodash'


export default function newMatchesReducer(state = initialState, action) {

  switch (action.type) {
      case 'RECEIVE_COUPLEREADY':
      case 'RECEIVE_DECOUPLE':
        return initialState;


      case 'REMOVE_MATCH':
        return {...state, [action.payload.matchID]: null }

      case 'GET_NEW_MATCHES_FULFILLED':
        if ( !action.payload.response ) return state;
        return action.payload.response.reduce( ( acc, el, i ) => {
          acc[ el.match_id ] = el;
          return acc
        }, {})


      case 'GET_MATCHES_FULFILLED':

        const matches = action.payload.response;
        if ( !matches ) return state;
        const match_ids = _.map(matches,'match_id');
        const deltaMatches = _.reject(state,(m) => { return m.match_id in match_ids});

        return deltaMatches.reduce((acc,el,i) =>{
          acc[el.match_id] = el;
          return acc
        },{})

      default:

        return state;
  }
}


const initialState = { };
