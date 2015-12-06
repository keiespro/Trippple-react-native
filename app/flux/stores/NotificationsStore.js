import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import UserActions from '../actions/UserActions'
import NotificationActions from '../actions/NotificationActions'
import MatchesStore from '../stores/MatchesStore'
import ChatStore from '../stores/ChatStore'
import { AsyncStorage, PushNotificationIOS, AlertIOS } from 'react-native'
import moment from 'moment'
import Promise from 'bluebird'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import Log from '../../Log'


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
      handleNewMessageData: MatchActions.GET_MESSAGES,
      handleUpdateBadgeNumber: NotificationActions.UPDATE_BADGE_NUMBER,
      handleLogOut: UserActions.LOG_OUT
    })

    this.on('init', () => {/*noop*/})
    this.on('error', (err, payload, currentState) => {
      console.log(err, payload, currentState);
    })
  }

  handleLogOut(){
    PushNotificationIOS.cancelAllLocalNotifications()
  }

  updateBadgeCount(delta){

    const newNotifications = delta || 0;

    React.NativeModules.PushNotificationManager.getApplicationIconBadgeNumber((result) => {
      React.NativeModules.PushNotificationManager.setApplicationIconBadgeNumber(result + newNotifications)
    })
  }

  handleUpdateBadgeNumber(amount){
    this.updateBadgeCount(amount);
  }

  handleMatchRemoved(){

  }
  expireNotification(){
    setTimeout(()=>{
      const {notifications} = this.state
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
    this.waitFor(MatchesStore)

    var {messages} = messagesData

    if(!this.state.pendingNotifications.length){return false}
    const { pendingNotifications} = this.state,
                readyNotification = { ...pendingNotifications.shift(), ...messages.message_thread[0], type: 'message'}

    if(pendingNotifications.length){
      this.updateBadgeCount(1)
    }
    this.expireNotification()

    this.setState({
      notifications: [...pendingNotifications, readyNotification],
      pendingNotifications: []
    })

  }

  handleNewMessage(payload){
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
    const newNotification = {
            title: payload.alert,
            match_id: payload.match_id,
            ...payload
          },
          allNotifications = [...this.state.pendingNotifications, newNotification];

    this.setState({
      pendingNotifications: allNotifications
    })

  }

}
export default alt.createStore(NotificationsStore, 'NotificationsStore')
