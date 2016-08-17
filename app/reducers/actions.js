import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import FBSDK from 'react-native-fbsdk'
const x = [
  'requestPin',
  'verifyPin',
  'fbLogin',
  'updateUser',
  'getMatches',
  'getNewMatches',
  'unMatch',
  'reportUser',
  'getNotificationCount',
  'getMessages',
  'createMessage',
  'sendLike',
  'decouple',
  'getCouplePin',
  'verifyCouplePin',
  'updatePushToken',
  'disableAccount',
  'getUserInfo',
  'getPotentials'
];

const d = x.map(call => {
  let action = call.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase()}).toUpperCase();
  return { action, call }
})

const ActionMan = d.reduce((obj,endpoint) => {

  obj[endpoint.call] = c => (dispatch => dispatch({
    type: endpoint.action,
    payload: {
      promise: new Promise((resolve, reject) => {
        api[endpoint.call]().then(x => resolve(x)).catch(x => reject(x))
      })
    }
  }))
  return obj
},{})

ActionMan.logOut = createAction('LOG_OUT');

ActionMan.showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

ActionMan.killModal = d => dispatch => dispatch({ type: 'KILL_MODAL' });

///// ASYNC ACTIONS ////////
ActionMan.getFacebookInfo = d => dispatch => {

  FBSDK.AccessToken.getCurrentAccessToken().then(response => {
    console.log(response);
    if (response) {
      // the user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid access token, a signed
      // request, and the time the access token
      // and signed request each expire

      dispatch({
        type: 'GET_FACEBOOK_INFO',
        payload: {fbUser: response}
      });

    } else if (response.status === 'not_authorized') {
      // the user is logged in to Facebook,
      // but has not authenticated your app
    } else {
      // the user isn't logged in to Facebook.
    }
 });
}

ActionMan.getPushToken = d => dispatch => dispatch({ type: 'GET_PUSH_TOKEN' });

ActionMan.checkLocation = l => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        geo => resolve(geo),
        error => reject(error),
        {
          enableHighAccuracy: false,
          maximumAge: 1
        }
      );
    })
  }
});

// export const getUserInfo = c => dispatch => dispatch({ type: 'GET_USER_INFO',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//       api.getUserInfo().then(x => resolve(x)).catch(x => reject(x))
//     })
//   }
// });
//
// export const getPotentials = c => dispatch => dispatch({ type: 'GET_POTENTIALS',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//       api.getPotentials().then(x => resolve(x)).catch(x => reject(x))
//     })
//   }
// });
//

export default ActionMan

ActionMan.saveCredentials = c => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: {
    promise: new Promise((resolve, reject) => {
      Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, c.user_id+'' , c.api_key)
        .then(x => resolve(x)).catch(x => reject(x))
    })
  }
});





// export const receiveUserInfo = createAction('GET_USER_INFO', async (cr) => {
//   const ui = await api.getUserInfo(cr)
//   return Promise.resolve(ui)
  // return Promise.resolve(api.getUserInfo(cr).then(x => {
  //   console.log(x);
  //   return x
  // }))
  // return Promise.resolve(api.getUserInfo(cr))
  // console.log(res);
  // return res
// });
