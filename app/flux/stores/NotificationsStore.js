import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import NotificationActions from '../actions/NotificationActions'

import { AsyncStorage, PushNotificationIOS } from 'react-native'
import moment from 'moment'
import Promise from 'bluebird'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import _ from 'underscore'
@reactMixin.decorate(TimerMixin)
class NotificationsStore {

  constructor() {

    this.state = {
      notifications: [],
      oldNotifications:[],
         pendingNotifications: []

    }

    this.bindListeners({
      handleMatchRemoved: NotificationActions.RECEIVE_MATCH_REMOVED_NOTIFICATION,
      handleNewMatch: NotificationActions.RECEIVE_NEW_MATCH_NOTIFICATION,
      handleNewMessage: NotificationActions.RECEIVE_NEW_MESSAGE_NOTIFICATION,
      handleNewMatchData: MatchActions.GET_MATCHES,
      handleNewMessageData: MatchActions.GET_MESSAGES
    })

    this.on('init', () => {
      console.log('notifications store init')


    })

  }
  handleMatchRemoved(){

  }
  expireNotification(){
    setTimeout(()=>{
      const notifications = this.state.notifications
      this.setState({
         oldNotifications: notifications,
         notifications: [],
         pendingNotifications: []
      })
    },15500)
  }
  handleNewMatchData(matches){
    var pendingNotification = this.state.pendingNotifications[0]
    if(!pendingNotification){ return false }
    var match = _.filter(matches,(m) => m.id === pendingNotification.match_id);
    var readyNotification = { ...pendingNotification, ...match, type: 'match'}
    this.setState({
      notifications: [readyNotification],
      pendingNotifications: []
    })
    this.expireNotification()

  }
  handleNewMessageData(msgs){
    console.log(msgs)
    var pendingNotification = this.state.pendingNotifications[0]
    var readyNotification = { ...pendingNotification, ...msgs.message_thread[0], type: 'message'}
    this.setState({
      notifications: [readyNotification],
      pendingNotifications: []
    })
    this.expireNotification()


  }

  handleNewMessage(payload){
    console.log(payload)
    var newNotification = {
      title: payload.data.alert,
      match_id: payload.data.match_id,
      ...payload
    }

    const allNotifications = [...this.state.pendingNotifications, newNotification]
    this.setState({
      pendingNotifications: allNotifications
    })

  }

  handleNewMatch(payload){
   var newNotification = {
      title: payload.data.alert,
      match_id: payload.data.match_id,
      ...payload
    }

    const allNotifications = [...this.state.pendingNotifications, newNotification]
    this.setState({
      pendingNotifications: allNotifications
    })

  }

}
export default alt.createStore(NotificationsStore, 'NotificationsStore')
