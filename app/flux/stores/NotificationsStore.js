import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import NotificationActions from '../actions/NotificationActions'
import ChatStore from '../stores/ChatStore'
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
    this.on('error', (err, payload, currentState) => {
        console.log(err, payload);
    })

  }
  updateBadgeCount(delta){

    const newNotifications = delta || 0;

    React.NativeModules.PushNotificationManager.getApplicationIconBadgeNumber((result) => {
      React.NativeModules.PushNotificationManager.setApplicationIconBadgeNumber(result + newNotifications)
    })
  }
  handleMatchRemoved(){

  }
  expireNotification(){
    setTimeout(()=>{
      const notifications = this.state.notifications
      this.setState({
         oldNotifications: [...this.state.oldNotifications, ...notifications],
         notifications: [],
      })
    },3500)
  }
  handleNewMatchData(matchData){

    var {matches} = matchData
    var pendingNotification = this.state.pendingNotifications[0] || this.state.notifications[0]

    if(!pendingNotification){ return false }
    var match = _.filter(matches,(m) => m.match_id == pendingNotification.match_id);
    var readyNotification = { ...pendingNotification, ...match[0], type: 'match'}

    this.setState({
      notifications: [readyNotification],
      pendingNotifications: []
    })
    this.expireNotification()
    this.updateBadgeCount(1)

  }
  handleNewMessageData(messagesData){
    this.waitFor(ChatStore)
    var {messages} = messagesData

    if(!this.state.pendingNotifications.length){return false}
    const { pendingNotifications} = this.state,
                readyNotification = { ...pendingNotifications.shift(), ...messages.message_thread[0], type: 'message'}


    this.setState({
      notifications: [...pendingNotifications, readyNotification],
      pendingNotifications: []
    })
    this.updateBadgeCount(1)
    this.expireNotification()


  }

  handleNewMessage(payload){
    console.log(payload)
    var newNotification = {
      ...payload,
      title: payload.data.alert,
      match_id: payload.data.match_id,
    }

    const allNotifications = [...this.state.pendingNotifications, newNotification]
    this.setState({
      pendingNotifications: allNotifications
    })

  }

  handleNewMatch(payload){
   var newNotification = {
      title: payload.alert,
      match_id: payload.match_id,
      ...payload
    }

    const allNotifications = [...this.state.pendingNotifications, newNotification]
    this.setState({
      pendingNotifications: allNotifications
    })

  }

}
export default alt.createStore(NotificationsStore, 'NotificationsStore')
