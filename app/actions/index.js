import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import fbActions from './facebook'
const apiActions = [
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

const endpointMap = apiActions.map(call => {
  let action = call.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase()}).toUpperCase();
  return { action, call }
})

const ActionMan = endpointMap.reduce((obj,endpoint) => {
  obj[endpoint.call] = c => (dispatch => dispatch({
    type: endpoint.action,
    payload: {
      promise: new Promise((resolve, reject) => {
        api[endpoint.call]().then(x => resolve(x)).catch(x => reject(x))
      })
    }
  }))
  return obj
}, {
  ...fbActions
})

ActionMan.logOut = createAction('LOG_OUT');

ActionMan.showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

ActionMan.killModal = () => dispatch => dispatch({ type: 'KILL_MODAL' });



ActionMan.getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN' });

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

ActionMan.saveCredentials = c => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: {
    promise: new Promise((resolve, reject) => {
      Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, c.user_id+'' , c.api_key)
        .then(x => resolve(x)).catch(x => reject(x))
    })
  }
});




export default ActionMan


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
