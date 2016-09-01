
export default function appReducer(state = initialState, action) {

  switch (action.type) {
      case 'GET_COUPLE_PIN_FULFILLED':
        return {...state, couplePin: action.payload.response.pin}
      case 'CONNECTION_CHANGE':
        let newState = {};
        if(action.payload.hasOwnProperty('isConnected')){
          newState = action.payload
        }else if(action.payload.hasOwnProperty('connectionType')){
          newState = action.payload
        }

        return {...state, ...newState}
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
