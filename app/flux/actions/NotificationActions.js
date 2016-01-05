import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'



class NotificationActions {


  requestNotificationsPermission() {
    return function(dispatch) {
      PushNotificationIOS.addEventListener('register',(token) => {
        __DEV__ && console.log('APN -> ',token);
        Api.updatePushToken(token)
        .then(()=> dispatch(token))
      })
      PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})
    };
  }

  updateBadgeNumber(numberToAdd){
    return numberToAdd;;
  }


  sendFakeNotification() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  dispatchNotification(payload){
    return payload;;
  }

  receiveNewMessageNotification(payload, isBackground) {
    return function(dispatch) {
      const { data } = payload


      if(data.action === 'retrieve' && data.match_id) {
        MatchActions.getMessages.defer(data.match_id)
      }
      if(!isBackground){
        dispatch(payload)
      }
    };
  }
  receiveNewMatchNotification(payload, isBackground) {
    return function(dispatch) {
      const { action } = payload
      if(action === 'retrieve') {
        MatchActions.getMatches.defer()
      }
      if(!isBackground){
        dispatch(payload)
      }
    };
  }
  receiveMatchRemovedNotification(payload){
    return payload.match_id;;
  }

  scheduleNewPotentialsAlert(time) {
    return function(dispatch) {
      let t = time || false;
      let fireDate = t ? moment(t).unix() : moment().endOf('day').unix();

      const data = {
              alert: {
                title: 'New Matches!',
                body: 'body',
              },
              action:'retrieve',
              type: 'potentials',
              sound: 'default',
              category: 'TRIPPPLE',
              badge: '+1'
            };
      PushNotificationIOS.scheduleLocalNotification({ fireDate, data })
      dispatch()
    };
  }
}

export default alt.createActions(NotificationActions)
