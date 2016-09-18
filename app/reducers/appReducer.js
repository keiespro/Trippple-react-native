import {REHYDRATE,REHYDRATE_ERROR} from 'redux-persist/constants'

export default function appReducer(state = initialState, action) {

  switch (action.type) {
      case REHYDRATE_ERROR:
        return {...state, booted: true}
      case REHYDRATE:
        return {...state, booted: true}

      case 'GET_COUPLE_PIN_FULFILLED':
        return {...state, couplePin: action.payload.response.pin}

      case 'VERIFY_COUPLE_PIN_FULFILLED':
        return {...state, coupling: action.payload.response}

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
