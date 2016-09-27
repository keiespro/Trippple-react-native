import {NativeModules,ActionSheetIOS,PushNotificationIOS,Platform} from 'react-native'
const {RNMessageComposer} = NativeModules;
import Promise from 'bluebird'
import api from '../utils/api'
const iOS = Platform.OS == 'iOS';

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = ( ) => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});

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
                  __DEV__ && console.warn('DONE',error);
                  reject(error)
              },
              (success, method) => {
                  __DEV__ && console.warn('SUCCESS',success,method);
                  resolve({success,method})
              }) : resolve();
        // }
      // })
      })
  }
});

export const receivePushToken = push_token => dispatch => dispatch({ type: 'RECEIVE_PUSH_TOKEN',
  payload: {
      promise: new Promise((resolve, reject) => {

          dispatch({type: 'UPDATE_USER_PUSH_TOKEN', payload: api.updateUser({push_token})})
      })
  }
})


export const getPushToken = (p) => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
  payload: {
      promise: new Promise((resolve, reject) => {
          return iOS ? PushNotificationIOS.checkPermissions((permissions) => {
              const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
                  acc = acc + permissions[el];
                  return acc
              },0);

              if(permResult){
                  PushNotificationIOS.addEventListener('register', (push_token) =>{
                      __DEV__ && console.log( 'TOKEN:', push_token );
                      if(push_token){
                          dispatch({type:'SAVE_PUSH_TOKEN', payload: push_token})
                          resolve(push_token)

                      }else{
                          dispatch({type:'SAVE_PUSH_TOKEN_FAILED', payload: null})
                          // reject()
                      }
                  })

                  PushNotificationIOS.addEventListener('registrationError', (err) =>{
                      __DEV__ && console.log( 'TOKEN registrationError:', err );
                  });
                  PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})
              }else{
                  reject('no permission')
              }
          }) : resolve()
      })
  }
})
