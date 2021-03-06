export default function facebookReducer(state = initialState, action) {

  switch (action.type) {

      case 'FACEBOOK_AUTH':
      case 'ADD_FACEBOOK_PERMISSIONS':
      case 'FACEBOOK_AUTH_FULFILLED':
      case 'ADD_FACEBOOK_PERMISSIONS_FULFILLED':

        return {...state, ...action.payload};

      case 'LOGIN_WITH_FACEBOOK':
      case 'LOGIN_WITH_FACEBOOK_FULFILLED':
        console.log(action.payload);
        let payl = {...action.payload}
        delete payl.response
        delete payl.status
        return {...state, ...payl};

      case 'GET_FACEBOOK_PROFILE':
      case 'GET_FACEBOOK_PROFILE_FULFILLED':
        return {...state, profile: action.payload};

      case 'GET_FACEBOOK_INFO':
      case 'GET_FACEBOOK_INFO_FULFILLED':

        return {...state, ...action.payload};

      case 'LOG_OUT':
      case 'LOG_OUT_FULFILLED':

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
