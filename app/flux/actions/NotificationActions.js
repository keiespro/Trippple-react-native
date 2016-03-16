import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
// import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'
import Analytics from '../../utils/Analytics'
const LAST_SCHEDULED_DATE = 'LAST_SCHEDULED_DATE';


class NotificationActions {

  requestNotificationsPermission() {
    return (dispatch) => {
      PushNotificationIOS.addEventListener('register',(token) => {
        __DEV__ && console.warn('APN -> ',token);
        Api.updatePushToken(token)
        .then(()=> dispatch(token))
        .catch((err) => {
          dispatch({error: err})
        })
      })
      PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})
    };
  }

  updateBadgeNumber(numberToAdd){
    return numberToAdd
  }
  resetBadgeNumber(){
    return 0
  }
  sendFakeNotification() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    })

    return true
  }

  dispatchNotification(payload){
    return payload
  }

  receiveNewMessageNotification(payload, isBackground) {
    return (dispatch) => {
      const { data } = payload;
      if(data.action === 'retrieve' && data.match_id) {
        MatchActions.getMessages.defer(data.match_id)
      }
      if(!isBackground){
        dispatch(payload)
      }else{
        dispatch()
      }
    }
  }

  receiveNewMatchNotification(payload, isBackground) {
    return (dispatch) => {
      const { action } = payload;
      if(action === 'retrieve') {
        MatchActions.getMatches.defer()
      }
      if(!isBackground){
        dispatch(payload)
      }else{
        dispatch()
      }
    }
  }

  receiveMatchRemovedNotification(payload){
    return payload.match_id
  }

  scheduleNewPotentialsAlert() {
    return async (dispatch) => {
      let todayDate = new Date(),
          lastDate = await AsyncStorage.getItem(LAST_SCHEDULED_DATE);
      try{
        if( lastDate != todayDate.toDateString() ){

          let fireDate =  moment().endOf('day')
          Analytics.log(`Scheduled Local Notification`,fireDate.unix()*1000,fireDate.format())
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: fireDate.unix()*1000,
            alertBody: 'New Matches!',
            soundName: 'default'
          })
          AsyncStorage.setItem(LAST_SCHEDULED_DATE,todayDate.toDateString() )
        }
        dispatch(true)

      }catch(err){
        // console.log(err)
        dispatch(err)

      }
    }
  }

}

export default alt.createActions(NotificationActions)
