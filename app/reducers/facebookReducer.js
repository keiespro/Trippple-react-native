const REQUIRED_PERMISSIONS = ['user_location','user_birthday','user_photos','public_profile','email','user_friends','user_likes','contact_email'];

export default function facebookReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_FACEBOOK_INFO':
    console.log(action.payload);
      const fbUser = action.payload.fbUser || {}
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
