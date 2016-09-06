import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequestManager, GraphRequest} = FBSDK
import api from '../utils/api'
import * as firebase from 'firebase';
import checkFireLoginState from '../fire'

// LoginManager.setLoginBehavior('system_account')
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

const parameters = { fields: { string: FACEBOOK_PROFILE_FIELDS.join(',') } }



/* loginWithFacebook | LOGIN_WITH_FACEBOOK */
export const loginWithFacebook = () => async dispatch => {

  // LoginManager.setLoginBehavior('system_account')
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()
    const fbData = {...fb, ...fbUser}
    dispatch({ type: 'FACEBOOK_AUTH', payload: fbData})
    dispatch({ type: 'LOGIN_WITH_FACEBOOK', payload: api.fbLogin(fbData) })

    try{
      const fireUser = await checkFireLoginState(fbData)
      dispatch({ type: 'FIREBASE_AUTH', payload: fireUser })
    }catch(err){
      __DEV__ && console.log(err,'firebase fail');
    }
  }catch(err){
    __DEV__ && console.log('fb login failed',err)
    LoginManager.logOut()

  }
}



/* getFacebookInfo | GET_FACEBOOK_INFO */
export const getFacebookInfo = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()
    dispatch({ type: 'GET_FACEBOOK_INFO', payload: fbUser })
    dispatch(getFacebookProfile(fbUser))
  }catch(err){
    __DEV__ && console.log('No fb access token found',err)
  }
}

/* facebookAuth | FACEBOOK_AUTH */
export const facebookAuth = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'FACEBOOK_AUTH', payload: {...fb,...fbUser} })
  }catch(err){
    __DEV__ && console.log('fb login failed',err)
  }
}

/* getFacebookProfile | GET_FACEBOOK_PROFILE */
export const getFacebookProfile = fbUser => dispatch => {
  console.log(fbUser);
  const {accessToken} = fbUser;

  const infoRequest = new GraphRequest('me', {parameters, accessToken}, (err, fbProfile) => {
    if(err){
      __DEV__ && console.log('error getting fb profile',err);
      return
    }
    dispatch({ type: 'GET_FACEBOOK_PROFILE', payload: fbProfile })
  });

  const REQ = new GraphRequestManager().addRequest(infoRequest)
  REQ.start();
}


export const addFacebookPermissions = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'ADD_FACEBOOK_PERMISSIONS', payload: {...fb,...fbUser} })
  }catch(err){
    __DEV__ && console.log('fb login failed',err)
  }
}
