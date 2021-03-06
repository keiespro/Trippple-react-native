import {REHYDRATE} from 'redux-persist/constants'

export default function authReducer(state = initialState, action) {

  switch (action.type) {
      case REHYDRATE:
        let {auth} = action.payload;
        if(auth && auth.api_key && auth.user_id){
          const {api_key, user_id} = auth
          global.creds = { api_key, user_id }
        }
        return { ...state, ...auth }

      case 'FIREBASE_AUTH':
        return { ...state, firebaseUser: action.payload}

      case 'VERIFY_PIN_REJECTED':
      case 'REQUEST_PIN_REJECTED':
      case 'LOGIN_WITH_FACEBOOK_REJECTED':
        console.log(action);
        return { ...state, error: action.payload.response }

      case 'INITIALIZE_CREDENTIALS':
        let {username,password} = action.payload.response || action.payload;

        const c = {
          api_key: password,
          user_id: username
        }
      case 'SAVE_CREDENTIALS':
      case 'VERIFY_PIN_FULFILLED':
      case 'LOGIN_WITH_FACEBOOK_FULFILLED':

        let {api_key,user_id} = c || action.payload.response || action.payload;

        if(api_key && user_id){
          global.creds = { api_key, user_id }
          return {
            ...state,
            api_key,
            user_id,
          };
        }else{
          return { ...state }
        }


      case 'CLEAR_CREDENTIALS':
      case 'LOG_OUT_FULFILLED':

        return initialState;

      default:

        return state;
  }
}


const initialState = {
  api_key: null,
  user_id: null
};
