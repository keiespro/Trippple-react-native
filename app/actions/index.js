import { createAction, handleAction, handleActions } from 'redux-actions';
import * as fbActions from './facebook'
import * as appActions from './appActions'
import * as locationActions from './location'
import apiActions from './ApiActionCreators'
import api from '../utils/api'
import {NativeModules,Alert,PushNotificationIOS} from 'react-native'
import Promise from 'bluebird'
import Communications from 'react-native-communications';
import PushNotification from 'react-native-push-notification'

const {RNMessageComposer,RNMail} = NativeModules;
const getBadgeNumber = Promise.promisify(PushNotification.getApplicationIconBadgeNumber)
const getPushPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)
  
  
const ActionMan = {
  ...apiActions,
  ...fbActions,
  ...appActions,
  ...locationActions
}

ActionMan.ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

ActionMan.showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

ActionMan.killModal = (t) => dispatch => dispatch({ type: 'KILL_MODAL', payload: { t } });

ActionMan.pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

ActionMan.popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});

// ActionMan.getPushToken = (p) => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//
//       return getPushPermissions().then(PushNotificationIOS.requestPermissions))
//
//     })
//   }
// })

ActionMan.sendText = payload => dispatch => dispatch({ type: 'SEND_TEXT',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;
      Communications.text(null,messageText)

    })
  }
});

// //
// ActionMan.sendText = payload => dispatch => dispatch({ type: 'SEND_TEXT',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//       const { pin, messageText } = payload;
//       return RNMessageComposer.composeMessageWithArgs({ messageText }, result => {
//         switch(result) {
//             case RNMessageComposer.Sent:
//               resolve(result)
//               break;
//             case RNMessageComposer.Failed:
//             case RNMessageComposer.NotSupported:
//             case RNMessageComposer.Cancelled:
//             default:
//               Communications.text(null,messageText)
//               resolve(null)
//               break;
//         }
//       })
//     })
//   }
// });
//



const NOTIFICATION_TYPES = {
  NewMatch:       'getMatches',
  NewMessage:     'getMessages',
  MatchRemoved:   'getMatches',
  CoupleCreated:  'getUserInfo',
  Decouple:       'getUserInfo',
  Generic:        'getUserInfo',
};

ActionMan.receiveNotification = (notification) => dispatch => dispatch({ type: 'RECEIVE_NOTIFICATION',
  payload: new Promise((resolve, reject) => {
    console.log(notification,'_______________________________________________________');
    dispatch(ActionMan[NOTIFICATION_TYPES[notification.type]](notification.payload));
    resolve(notification.payload)
  })
}).then(() => notification).catch(console.log);

ActionMan.updateBadgeNumber = (delta) => dispatch => dispatch({ type: 'UPDATE_BADGE_NUMBER',
  payload: new Promise((resolve, reject) => {
    getBadgeNumber()
    .then(currentBadge => PushNotification.setApplicationIconBadgeNumber(currentBadge + delta))
    .then(resolve)
    .catch(reject)
  })
})

export default ActionMan
