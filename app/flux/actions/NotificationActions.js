import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'



class NotificationActions {



  dispatchNotification(payload){
    this.dispatch(payload)
  }

  receiveNewMessageNotification(payload){
    console.log('receive new message Notification',(payload))
    this.dispatch(payload)
    console.log(payload)
    const { data } = payload
    if(data.action === 'retrieve' && data.match_id) {
      MatchActions.getMessages(data.match_id)
    }

  }
  receiveNewMatchNotification(payload){
    console.log('receive New Match Notification',(payload))
    this.dispatch(payload)

    const { action } = payload
    if(action === 'retrieve') {
      MatchActions.getMatches()
    }



  }
  receiveMatchRemovedNotification(payload){
    console.log(payload)
    this.dispatch(payload.match_id)
  }

  scheduleNewPotentialsAlert(){
    const fireDate = moment({ hour: 23 }).toDate(), //tonight at 11
          alertBody = 'New Matches!'

    PushNotificationIOS.scheduleLocalNotification({ fireDate, alertBody })
  }
}

export default alt.createActions(NotificationActions)
