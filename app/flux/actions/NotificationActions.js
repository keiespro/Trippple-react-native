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




  initialize(){

    //
    // checkPermissions()
    // .then( () => this.scheduleNewPotentialsAlert())
    // .catch( (err) => {
    //   console.log(err)
    // })

  }
  receiveNotification(payload){
    console.log('receiveNotification',(payload))

  }

  scheduleNewPotentialsAlert(){
    const fireDate = moment({ hour: 23 }).toDate(), //tonight at 11
          alertBody = 'New Matches!'

    PushNotificationIOS.scheduleLocalNotification({ fireDate, alertBody })
  }
}

export default alt.createActions(NotificationActions)
