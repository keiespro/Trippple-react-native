import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequestManager, GraphRequest} = FBSDK
import api from '../utils/api'
import checkFireLoginState from '../fire'
import {NavigationActions} from '@exponent/ex-navigation'
import Router from '../Router'
import {checkLocationPermission} from './permissions/location'

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
export const loginWithFacebook = () => async (dispatch,getState) => {
  // LoginManager.setLoginBehavior('native')
  const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS);
  dispatch({ type: 'FACEBOOK_RESPONSE', payload: fb})

  const fbAuth = await AccessToken.getCurrentAccessToken()
  const fbData = {...fb, ...fbAuth}
    dispatch({ type: 'LOGIN_WITH_FACEBOOK', payload: api.fbLogin(fbData).then(result => {
      dispatch({ type: 'FACEBOOK_AUTH', payload: fbData})
      dispatch({ type: 'FIREBASE_AUTH', payload: checkFireLoginState(fbData, dispatch) })
        const state = getState()
        const navs = Object.keys(state.navigation.navigators)
        const navigatorUID = navs[0];
        const onboarded = result.user_id && result.fb_authorized && result.user_info.status == 'onboarded';

        dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute( onboarded ?  'Potentials' : 'OnboardModal')]));
        return result
    })
  })
  .catch(err => {
      __DEV__ && console.warn('fb login failed',err)
    // LoginManager.logOut()
  })
}


export const onboardUserNowWhat = payload => (dispatch,getState) => dispatch({ type: 'ONBOARD_USER_NOW_WHAT',
  payload: new Promise((resolve, reject) => {

    dispatch(api.onboard(payload).then(result => {
      const state = getState()

      if(state.permissions.location || state.permissions.location != 'undetermined'){
        const navs = Object.keys(state.navigation.navigators)
        const navigatorUID = navs[0];

        dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute('Potentials' )]));
        return resolve(state.permissions.location || permission)
      }

      return checkLocationPermission(result).then( permission => {
        const navs = Object.keys(state.navigation.navigators)
        const navigatorUID = navs[0];

        dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute('Potentials' )]));
        return permission
      })

    })
    .catch(permission => {
      console.log(permission);
      const state = getState()
      const navs = Object.keys(state.navigation.navigators)
      const navigatorUID = navs[0];

      dispatch(NavigationActions.immediatelyResetStack(navigatorUID, [Router.getRoute( 'LocationPermissions')]));
      return permission
    }))


  })
})




export const sessionAuth = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'FACEBOOK_AUTH', payload: fbUser })
    dispatch({ type: 'FIREBASE_AUTH', payload: checkFireLoginState(fbUser, dispatch) })
  }catch(err){
    __DEV__ && console.log('3rdparty login failed', err)
  }
}


/* getFacebookInfo | GET_FACEBOOK_INFO */
export const getFacebookInfo = () => async dispatch => {
  try{
    const fbUser = await AccessToken.getCurrentAccessToken()
    dispatch({ type: 'GET_FACEBOOK_INFO', payload: fbUser })
    dispatch(getFacebookProfile(fbUser))
  }catch(err){
    __DEV__ && console.log('No fb access token found', err)
  }
}

/* facebookAuth | FACEBOOK_AUTH */
export const facebookAuth = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'FACEBOOK_AUTH', payload: {...fb, ...fbUser} })
  }catch(err){
    __DEV__ && console.log('facebookAuth FACEBOOK_AUTHfb login failed', err)
  }
}

/* getFacebookProfile | GET_FACEBOOK_PROFILE */
export const getFacebookProfile = fbUser => dispatch => {
  const {accessToken} = fbUser;

  const infoRequest = new GraphRequest('me', {parameters, accessToken}, (err, fbProfile) => {
    if(err){
      __DEV__ && console.log('error getting fb profile', err);
      return
    }
    dispatch({ type: 'GET_FACEBOOK_PROFILE', payload: fbProfile })
  });

  const REQ = new GraphRequestManager().addRequest(infoRequest)
  REQ.start();
}


/* fetchFacebookAlbums | FETCH_FACEBOOK_ALBUMS */
export const fetchFacebookAlbums = fbUser => dispatch => dispatch({ type: 'FETCH_FACEBOOK_ALBUMS',
    payload: {
      promise: new Promise((resolve, reject) => {

        const {accessToken} = fbUser;
        const fbUrl = `https://graph.facebook.com/v2.8/${fbUser.userID}/albums?access_token=${fbUser.accessToken}&fields=id,photos{images},name,link,picture{url},count`;

        return fetch(fbUrl).then(res => {
          __DEV__ && console.log(res);
          return res.json()
        })
        .then(responseData => {
          __DEV__ && console.log(responseData);
          resolve(responseData)
        })
      })
    }
  })

  // const infoRequest = new GraphRequest('me', {parameters, accessToken}, (err, fbProfile) => {
  //   if(err){
  //     __DEV__ && console.log('error getting fb profile', err);
  //     return
  //   }
  //   dispatch({ type: 'GET_FACEBOOK_ALBUMS', payload: fbProfile })
  // });
  //
  // const REQ = new GraphRequestManager().addRequest(infoRequest)
  // REQ.start();
// }


export const addFacebookPermissions = () => async dispatch => {
  try{
    const fb = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS)
    const fbUser = await AccessToken.getCurrentAccessToken()

    dispatch({ type: 'ADD_FACEBOOK_PERMISSIONS', payload: {...fb, ...fbUser} })
  }catch(err){
    __DEV__ && console.log('fb login failed', err)
  }
}
