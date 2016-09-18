// import {NativeModules} from 'react-native'
// const {RNMessageComposer,RNMail} = NativeModules;
import Promise from 'bluebird'
import Communications from 'react-native-communications';

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = (     ) => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch =>  dispatch({ type: 'POP_CHAT'});

export const sendText = payload => dispatch =>  dispatch({ type: 'SEND_TEXT',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;
      Communications.text(null, messageText)
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


// ActionMan.getPushToken = (p) => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//
//       return getPushPermissions().then(PushNotificationIOS.requestPermissions))
//
//     })
//   }
// })


