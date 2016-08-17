export default function facebookReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_FACEBOOK_INFO':

      const fbUser = action.payload || {}
      return {...state, ...fbUser};

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
