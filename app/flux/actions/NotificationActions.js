import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'
console.log(window.navigator.userAgent)
window.navigator.userAgent = 'react-native'
import io from 'socket.io-client/socket.io'

const checkPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)

class NotificationActions {



  dispatchNotification(payload){
    this.dispatch(payload)
  }




  initialize(){


    checkPermissions()
    .then( () => this.scheduleNewPotentialsAlert())
    .catch( (err) => {
      console.log(err)
    })

  }


  scheduleNewPotentialsAlert(){
    const fireDate = moment({ hour: 23 }).toDate(), //tonight at 11
          alertBody = 'New Matches!'

    PushNotificationIOS.scheduleLocalNotification({ fireDate, alertBody })
  }
}

export default alt.createActions(NotificationActions)
