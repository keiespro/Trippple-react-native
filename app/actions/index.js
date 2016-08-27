import { createAction, handleAction, handleActions } from 'redux-actions';
import * as fbActions from './facebook'
import * as appActions from './appActions'
import apiActions from './ApiActionCreators'
import {NativeModules,Alert} from 'react-native'
const {OSPermissions,RNMessageComposer,RNMail} = NativeModules;
import Promise from 'bluebird'
const ActionMan = {
  ...apiActions,
  ...fbActions,
  ...appActions
}

const getBadgeNumber = Promise.promisify(PushNotification.getApplicationIconBadgeNumber)
import PushNotification from 'react-native-push-notification'

ActionMan.ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

ActionMan.showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

ActionMan.killModal = (t) => dispatch => dispatch({ type: 'KILL_MODAL', payload: { t } });

ActionMan.getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN' });

ActionMan.sendText = payload => dispatch => dispatch({ type: 'SEND_TEXT',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;
      return RNMessageComposer.composeMessageWithArgs({ messageText }, result => {
        console.log(result);
        switch(result) {
          case RNMessageComposer.Sent:
            resolve(result)
            break;
          case RNMessageComposer.Failed:
            Alert.alert('Whoops', 'Try that again')
            reject(result)

            break;
          case RNMessageComposer.NotSupported:
            Alert.alert('Error', 'Unable to send messages')
            reject(result)
            break;
          case RNMessageComposer.Cancelled:
          default:
            reject(result)
            break;
        }
      })
    })
  }
});


  ActionMan.screenshot = l => dispatch => dispatch({ type: 'CAPTURE_SCREENSHOT',
    payload: {
      promise: new Promise((resolve, reject) => {
        UIManager.takeSnapshot('window', {format: 'jpeg', quality: 0.8})
          .then(resolve)
          .catch(reject)
      })
    }
  })

ActionMan.sendTelemetry = p => dispatch => dispatch({ type: 'CAPTURE_SCREENSHOT',
  payload: {
    promise: new Promise((resolve, reject) => async() =>{

      try{
        const Telemetry = await AppTelemetry.getEncoded();
        return resolve(await Api.sendTelemetry(Telemetry))
      }catch(err){
        return reject(err)
      }
    } )
  }
})

ActionMan.checkLocation = l => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      OSPermissions.canUseLocation(OSLocation => {
          const perm = parseInt(OSLocation) > 2  ? true : false;
          if(perm){
            resolve(ActionMan.getLocation())
          }else{
            reject(new Error('nopermission'))
          }
      });
    })
  }
});

ActionMan.getLocation = l => dispatch => dispatch({ type: 'GET_LOCATION',
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


const NOTIFICATION_TYPES = {
  'NewMatch': 'getMatches',
  'NewMessage': 'getMessages',
  'MatchRemoved': 'getMatches',
  'CoupleCreated': 'getUserInfo',
  'Decouple': 'getUserInfo',
  'Generic': '',
};
//
export const receiveNotification = payload => dispatch => dispatch({ type: 'RECEIVE_NOTIFICATION',
  payload: new Promise((resolve, reject) => {
    const actionName = NOTIFICATION_TYPES[notification]
    dispatch(ActionMan[actionName]().then(resolve).catch(reject))
  })
});



ActionMan.updateBadgeNumber = createAction('UPDATE_BADGE_NUMBER', async (delta) => {
    const currentBadge = await getBadgeNumber()
    return PushNotification.setApplicationIconBadgeNumber(currentBadge + delta )
})

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
