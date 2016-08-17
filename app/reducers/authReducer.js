
export default function authReducer(state = initialState, action) {

  switch (action.type) {

    case 'SAVE_CREDENTIALS':

       return {
         ...state,
         api_key: action.payload.api_key,
         user_id: action.payload.user_id

       };

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
