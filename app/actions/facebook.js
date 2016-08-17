import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequestManager, GraphRequest} = FBSDK

const FACEBOOK_PERMISSIONS = [
  'email',
  'public_profile',
  'user_birthday',
  'user_friends',
  'user_likes',
  'user_location',
  'user_photos'
];

const FACEBOOK_PROFILE_FIELDS = [
  'email',
  'albums',
  'birthday',
  'name',
  'location',
  'friends',
  'photos',
  'likes',
  'about',
  'cover',
  'devices',
  'gender',
  'interested_in',
  'relationship_status',
  'significant_other',
  'timezone',
  'picture'
];

export const getFacebookInfo = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()
    dispatch({ type: 'GET_FACEBOOK_INFO', payload: fbUser })
    dispatch(getFacebookProfile(fbUser))
  }catch(err){
    __DEV__ && console.log('No fb access token found',err)
  }
}


export const facebookAuth = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    dispatch({ type: 'FACEBOOK_AUTH', payload: fb })
    dispatch(getFacebookInfo())
  }catch(err){
    __DEV__ && console.log('fb login failed',err)
  }
}


export const getFacebookProfile = fbUser => dispatch => {
  const graphParams = {
    parameters:{
      fields: {
        string: FACEBOOK_PROFILE_FIELDS.join(',')
      }
    },
    accessToken: fbUser.accessToken
  };

  const infoRequest = new GraphRequest(`/${fbUser.userID}/`, graphParams, (err,fbProfile) => {
    dispatch({ type: 'GET_FACEBOOK_PROFILE', payload: fbProfile })

  });

  const FBG = new GraphRequestManager();
  const REQ = FBG.addRequest(infoRequest)
  REQ.start();
}

export default {
  facebookAuth, getFacebookInfo, getFacebookProfile
}
