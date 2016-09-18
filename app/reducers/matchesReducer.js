
export default function matchesReducer(state = initialState, action) {


  switch (action.type) {
    case 'ONBOARD_FULFILLED':
    case 'VERIFY_COUPLE_PIN_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
    case 'HANDLE_NOTIFICATION_DECOUPLE':

        return initialState;

    case 'REMOVE_MATCH':
        return {...state, [action.payload.matchID]: null }

      case 'GET_MATCHES_FULFILLED':
        const matches = action.payload.response;
        if ( !matches ) return state;

        const matchesHash = matches.reduce( ( acc, el, i ) => {
          acc[ el.match_id ] = el;
          acc.lastRead = Date.now()
          return acc
        }, {})
        return {...state, ...matchesHash}

      default:

        return state;
  }
}


const initialState = { };
