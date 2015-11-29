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

      Api.updatePushToken(token)
      .then(()=> this.dispatch(token))
    })
    PushNotificationIOS.requestPermissions((result) =>{


    })

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

  receiveNewMessageNotification(payload){
    const { data } = payload
    if(data.action === 'retrieve' && data.match_id) {
      MatchActions.getMessages.defer(data.match_id)

    }
    this.dispatch(payload)

  }
  receiveNewMatchNotification(payload){

    const { action } = payload
    if(action === 'retrieve') {
      MatchActions.getMatches.defer()
    }
    this.dispatch(payload)



  }
  receiveMatchRemovedNotification(payload){
    this.dispatch(payload.match_id)
  }

  scheduleNewPotentialsAlert(time){
    const fireDate = moment((time || { hour: 24 })).toDate(), //tonight at midnight
          alertBody = 'New Matches!'
    PushNotificationIOS.scheduleLocalNotification({ fireDate: fireDate.getTime(), alertBody })
  }
}

export default alt.createActions(NotificationActions)
