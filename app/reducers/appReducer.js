
export default function appReducer(state = initialState, action) {

  switch (action.type) {
  case 'GET_COUPLE_PIN_FULFILLED':
    console.log(action);
    return {...state, couplePin: action.payload.response.pin}
  case 'CONNECTION_CHANGE':
    console.log(action);
    let newState = {};
    if(action.payload.hasOwnProperty('isConnected')){
      newState = action.payload
    }else if(action.payload.hasOwnProperty('connectionType')){
      newState = action.payload
    }

    return {...state, ...newState}
  case 'APP_STATE_CHANGE':
    console.log(action);

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
