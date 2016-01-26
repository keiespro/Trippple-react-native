import alt from '../alt'
import Api from '../../utils/api'
import Keychain from 'Keychain'
import moment from 'moment'
// import Promise from 'bluebird'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import { AsyncStorage, PushNotificationIOS } from 'react-native'
import Log from '../../Log'
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

  scheduleNewPotentialsAlert(time) {



    return async (dispatch) => {
      let todayDate = new Date()
      let lastDate = await AsyncStorage.getItem(LAST_SCHEDULED_DATE);
      if( lastDate != todayDate.toDateString() ){
        let fireDate =  moment( todayDate.getTime() ).endOf('day')
        Log(`Scheduled Local Notification`,fireDate.format())
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: fireDate.unix(),
          alertBody: 'New Matches!'
        })
        AsyncStorage.setItem(LAST_SCHEDULED_DATE,todayDate.toDateString() )
      }
      dispatch()
    }
  }

}

export default alt.createActions(NotificationActions)
