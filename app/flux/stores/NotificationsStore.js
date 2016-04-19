import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'
import NotificationActions from '../actions/NotificationActions'
import MatchesStore from '../stores/MatchesStore'
import ChatStore from '../stores/ChatStore'
import { AsyncStorage, PushNotificationIOS, AlertIOS } from 'react-native'
import moment from 'moment'
 import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'

class NotificationsStore {

  constructor() {

    this.state = {
      notifications: [],
      oldNotifications:[],
      pendingNotifications: []

    }
    this.timer = null;

    this.bindListeners({
      handleMatchRemoved: NotificationActions.RECEIVE_MATCH_REMOVED_NOTIFICATION,
      handleNewMatch: NotificationActions.RECEIVE_NEW_MATCH_NOTIFICATION,
      handleNewMessage: NotificationActions.RECEIVE_NEW_MESSAGE_NOTIFICATION,
      handleNewMatchData: MatchActions.GET_NEW_MATCHES,
      handleNewMessageData: MatchActions.GET_MESSAGES,
      handleUpdateBadgeNumber: NotificationActions.UPDATE_BADGE_NUMBER,
      handleResetBadgeNumber: NotificationActions.RESET_BADGE_NUMBER,
      handleLogOut: UserActions.LOG_OUT,
      clearNotifications: AppActions.UPDATE_ROUTE
    })


    this.on('init', () => {
      Analytics.all('INIT NotificationsStore');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR NotificationsStore',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP NotificationsStore',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      Analytics.all('AFTEREACH notifications store', {...x});
    });
  }

  handleLogOut(){
    PushNotificationIOS.cancelAllLocalNotifications()
    this.emitChange()
  }

  updateBadgeCount(delta){

    const newNotifications = delta || 0;

    React.NativeModules.PushNotificationManager.getApplicationIconBadgeNumber((result) => {
      React.NativeModules.PushNotificationManager.setApplicationIconBadgeNumber(result + newNotifications)
    })
  }

  handleResetBadgeNumber(){
    React.NativeModules.PushNotificationManager.setApplicationIconBadgeNumber(0)
  }

  handleUpdateBadgeNumber(amount){
    this.updateBadgeCount(amount);
  }

  handleMatchRemoved(){

  }
  expireNotification(){
    this.clearTimeout(this.timer);

    this.timer = setTimeout(()=>{
      const {notifications} = this.state
      this.setState({
         oldNotifications: [...this.state.oldNotifications, ...notifications],
         notifications: [],
         pendingNotifications:[]
      })
    },3500)
  }
  handleNewMatchData(matchData){
    this.waitFor(MatchesStore)

    var {matches} = matchData
    var pendingNotification = this.state.pendingNotifications[0]
    if(!matches || !pendingNotification){ return false}
    if(pendingNotification.type != 'match'){ return false };
    // var newmatch = _.find(matches,function(ma) {
    //   // AlertIOS.alert('m',m.match_id+' - ' +pendingNotification.match_id)
    //
    //   return ma.match_id == pendingNotification.match_id;
    // });
    this.clearTimeout(this.timer);

    var newmatch = matches[0]
    var readyNotification = { ...pendingNotification, ...newmatch, type: 'match'}

    setTimeout(()=>{

      this.setState({
        notifications: [readyNotification],
      })
    },100);
    this.expireNotification()
    this.updateBadgeCount(0)

  }
  handleNewMessageData(messagesData){
    this.clearTimeout(this.timer);

    this.waitFor(ChatStore)
    this.waitFor(MatchesStore)


    var {messages} = messagesData
    var pendingNotification = this.state.pendingNotifications[0]
    var pendingNotifications = this.state.pendingNotifications;
    if(!messages || !pendingNotification){ return false}
    if(pendingNotification.type != 'message'){ return false };
    const readyNotification = { ...pendingNotification, ...messages.message_thread[0]}
    this.clearTimeout(this.timer);

    setTimeout(()=>{
      this.setState({
        notifications: [readyNotification],
      })
    },100);

    this.updateBadgeCount(0)

    this.expireNotification()


  }

  handleNewMessage(payload){

    var newNotification = {
      title: payload.data.alert,
      match_id: payload.data.match_id,
      ...payload,
     type: 'message'
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
            ...payload,
             type: 'match'
          },
          allNotifications = [...this.state.pendingNotifications, newNotification];

    this.setState({
      pendingNotifications: allNotifications
    })

  }
  clearNotifications(payload){
    if(!payload.notification){ return false}

    this.setState({notifications:[],pendingNotifications:[]})


  }
}
reactMixin(NotificationsStore.prototype, TimerMixin)

export default alt.createStore(NotificationsStore, 'NotificationsStore')
