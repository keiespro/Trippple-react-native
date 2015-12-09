import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'



class NotificationActions {


  requestNotificationsPermission(){
    PushNotificationIOS.addEventListener('register',(token) => {
      __DEV__ && console.log('APN -> ',token);
      Api.updatePushToken(token)
      .then(()=> this.dispatch(token))
    })
    PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})

  }

  updateBadgeNumber(numberToAdd){
    this.dispatch(numberToAdd)
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
    this.dispatch(payload)
  }

  receiveNewMessageNotification(payload,isBackground){
    const { data } = payload


    if(data.action === 'retrieve' && data.match_id) {
      MatchActions.getMessages.defer(data.match_id)
    }
    if(!isBackground){
      this.dispatch(payload)
    }
  }
  receiveNewMatchNotification(payload,isBackground){

    const { action } = payload
    if(action === 'retrieve') {
      MatchActions.getMatches.defer()
    }
    if(!isBackground){
      this.dispatch(payload)
    }

  }
  receiveMatchRemovedNotification(payload){
    this.dispatch(payload.match_id)
  }

  scheduleNewPotentialsAlert(time){
    var t = time ||  { hour: 23, minute: 59 }
    const fireDate = moment(t).toDate(), //tonight at midnight
          data = {
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
    PushNotificationIOS.scheduleLocalNotification({ fireDate: fireDate.getTime(), data })
  }
}

export default alt.createActions(NotificationActions)
