export default function facebookReducer(state = initialState, action) {

  switch (action.type) {

    case 'FACEBOOK_AUTH':

    return {...state, ...action.payload};


  case 'GET_FACEBOOK_INFO':

      return {...state, ...action.payload};

    case 'LOG_OUT':

      return initialState;

    default:

      return state;
  }
}


const initialState = {
  accessToken: null,
  permissions: [],
  declinedPermissions:[],
  applicationID: "367243980090932",
  userID: null,
  expirationTime:null,
  lastRefreshTime:null
};
