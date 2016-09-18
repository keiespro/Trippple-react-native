import {NativeModules,ActionSheetIOS} from 'react-native'
const {RNMessageComposer} = NativeModules;
import Promise from 'bluebird'

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = (     ) => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch =>  dispatch({ type: 'POP_CHAT'});

export const sendText = payload => dispatch =>  dispatch({ type: 'SEND_TEXT',
  payload: {
    promise: new Promise((resolve, reject) => {

      const { pin, messageText } = payload;
      //  return RNMessageComposer.composeMessageWithArgs({ messageText }, (result) => {
      //    console.warn(result);
      //    switch(result) {
      //       case RNMessageComposer.Sent:
      //         return resolve(result)
      //       case RNMessageComposer.Failed:
      //       case RNMessageComposer.NotSupported:
      //       case RNMessageComposer.Cancelled:
      //       default:

              return ActionSheetIOS.showShareActionSheetWithOptions({
                url: `trippple://joincouple/${pin}`,
                message: messageText,
                subject: '',
                excludedActivityTypes: [
                  'com.apple.UIKit.activity.PostToTwitter',
                  'com.apple.UIKit.activity.PostToFacebook',
                  'com.apple.UIKit.activity.AddToReadingList',
                  'com.apple.UIKit.activity.Open',
                  'com.google.GooglePlus.ShareExtension',
                  'com.tumblr.tumblr.Share-With-Tumblr',
                  'pinterest.ShareExtension',
                  'com.linkedin.LinkedIn.ShareExtension',
                  'com.facebook.Facebook.ShareExtension',
                ]
              },
              (error) => {
                console.warn('DONE',error);
                reject(error)
              },
              (success, method) => {
                console.warn('SUCCESS',success,method);
                resolve(success)    
              });
        // }
      // })
    })
  }
});



// ActionMan.getPushToken = (p) => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
//   payload: {
//     promise: new Promise((resolve, reject) => {
//
//       return getPushPermissions().then(PushNotificationIOS.requestPermissions))
//
//     })
//   }
// })


