
export default function appReducer(state = initialState, action) {

  switch (action.type) {
    case 'GET_COUPLE_PIN_FULFILLED':
      console.log(action);
      return {...state, couplePin: action.payload.response.pin}
    case 'CONNECTION_CHANGE':
      return {...state, connection: action.payload}
    case 'APP_STATE_CHANGE':
      return {...state, appState: action.payload}

    default:

      return state;
  }
}


const initialState = {

  visibility: null,
  version: null,
  network: null,

};
