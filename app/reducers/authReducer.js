import {REHYDRATE} from 'redux-persist/constants'

export default function authReducer(state = initialState, action) {

  switch (action.type) {
    case REHYDRATE:
      console.log(action);
      let {auth} = action.payload;
      if(auth && auth.api_key && auth.user_id){
        var {api_key, user_id} = auth
        global.creds = { api_key, user_id }
      }
      return { ...state, ...auth }

    case 'SAVE_CREDENTIALS':
    case 'VERIFY_PIN_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':

      var {api_key,user_id} = action.payload.response || action.payload;
      console.log(api_key,user_id);

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
    case 'LOG_OUT':

      return initialState;

    default:

      return state;
  }
}


const initialState = {
  api_key: null,
  user_id: null
};
