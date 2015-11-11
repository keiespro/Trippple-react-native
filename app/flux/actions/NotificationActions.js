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
      console.log('APN TOKEN?',token,Api)

      Api.updatePushToken(token)
      .then(()=> this.dispatch(token))
    })
    PushNotificationIOS.requestPermissions()




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
    console.log('receive new message Notification',(payload))
    console.log(payload)
    const { data } = payload
    if(data.action === 'retrieve' && data.match_id) {
      MatchActions.getMessages.defer(data.match_id)
      console.log('MatchActions.getMessages(data.match_id)')

    }
    this.dispatch(payload)

  }
  receiveNewMatchNotification(payload){
    console.log('receive New Match Notification',(payload))

    const { action } = payload
    if(action === 'retrieve') {
      MatchActions.getMatches.defer()
    }
    this.dispatch(payload)



  }
  receiveMatchRemovedNotification(payload){
    console.log(payload)
    this.dispatch(payload.match_id)
  }

  scheduleNewPotentialsAlert(){
    const fireDate = moment({ hour: 23 }).toDate(), //tonight at 11
          alertBody = 'New Matches!'

    // PushNotificationIOS.cancelAllLocalNotifications()
    PushNotificationIOS.scheduleLocalNotification({ fireDate, alertBody })
  }
}

export default alt.createActions(NotificationActions)
