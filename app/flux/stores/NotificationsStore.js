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
      // handleSentLike: MatchActions.SEND_LIKE
    })

    this.on('init', () => {
      console.log('notifications store init')


    })

  }

}
export default alt.createStore(NotificationsStore, 'NotificationsStore')
