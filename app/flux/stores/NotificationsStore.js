import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import NotificationActions from '../actions/NotificationActions'

import { AsyncStorage, PushNotificationIOS } from 'react-native'
import moment from 'moment'
import Promise from 'bluebird'

class NotificationsStore {

  constructor() {

    this.state = {    }

    this.bindListeners({
      handleReceiveNotification: NotificationActions.RECEIVE_NOTIFICATION
    })

    this.on('init', () => {
      console.log('notifications store init')


    })

  }
  handleReceiveNotification(){
    console.log('handleReceiveNotification')
  }

}
export default alt.createStore(NotificationsStore, 'NotificationsStore')
