import {NativeModules, Share, PushNotificationIOS, Platform} from 'react-native'
const {RNMessageComposer} = NativeModules;
import RNHotline from '../../lib/RNHotline/'
import Promise from 'bluebird'
import api from '../utils/api'
import FCM from 'react-native-fcm'
const iOS = Platform.OS == 'ios';

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = () => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});


export const setHotlineUser = user => dispatch => dispatch({ type: 'SET_HOTLINE_USER',
  payload: {
    promise: new Promise((resolve, reject) => {
      const {id, firstname, phone, relationship_status, email, gender, image_url, thumb_url, partner_id} = user;
      // RNHotline.setUser(`${id}`, firstname, phone, email, {relationship_status, gender, image_url, thumb_url, partner_id: `${partner_id}`});
      resolve();
    })
  }
})

export const share = payload => dispatch => dispatch({ type: 'SHARE_COUPLE_PIN',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;

          Share.share({
            title:'Join my couple!',
            message:'ok'
          }, {
            dialogTitle:'Send your couple pin'
          })
          .then(resolve)
          .catch(reject)
    })
  }
});

export const sendText = payload => dispatch => dispatch({ type: 'SEND_TEXT',
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

      return iOS ? ActionSheetIOS.showShareActionSheetWithOptions({
        url: `trippple://joincouple/${pin}`,
        message: messageText,
        subject: '',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter',
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.AddToReadingList',
                  // 'com.apple.UIKit.activity.Open',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
          'pinterest.ShareExtension',
          'com.linkedin.LinkedIn.ShareExtension',
          'com.facebook.Facebook.ShareExtension',
        ]
      },
              (error) => {
                __DEV__ && console.warn('DONE', error);
                reject(error)
              },
              (success, method) => {
                __DEV__ && console.warn('SUCCESS', success, method);
                resolve({success, method})
              }) : resolve();
        // }
      // })
    })
  }
});

export const receivePushToken = push_token => dispatch => dispatch({ type: 'RECEIVE_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {

      dispatch({type: 'UPDATE_USER_PUSH_TOKEN', payload: api.updatePushToken({push_token})})
      resolve()
    })
  }
})


export const getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      FCM.getFCMToken().then(push_token => {
        dispatch(receivePushToken(push_token))
        dispatch({type: 'SAVE_PUSH_TOKEN', payload: push_token})
      })
         .catch(x => console.log(x))
    })
  }
})
