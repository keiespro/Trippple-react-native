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
    // setTimeout(()=>{
    //   const notifications = this.state.notifications
    //   this.setState({
    //      oldNotifications: [...this.state.oldNotifications, ...notifications],
    //      notifications: [],
    //   })
    // },3500)
  }
  handleNewMatchData(matchData){
    var {matches} = matchData
    var pendingNotification = this.state.pendingNotifications[0] || this.state.notifications[0]
    console.log(matches,pendingNotification)
    console.log('NOTI STOR handleNewMatchData',pendingNotification)

    if(!pendingNotification){ return false }
    var match = _.filter(matches,(m) => m.match_id == pendingNotification.match_id);
    console.log(pendingNotification,match,matches)
    var readyNotification = { ...pendingNotification, ...match[0], type: 'match'}
    console.log('NOTI STOR handleNewMatchData',readyNotification)

    this.setState({
      notifications: [readyNotification],
      pendingNotifications: []
    })
    this.expireNotification()

  }
  handleNewMessageData(messagesData){
    var {messages} = messagesData

    const {pendingNotifications} = this.state,
        readyNotification = { ...pendingNotifications[0], ...messages.message_thread[0], type: 'message'}

    pendingNotifications.shift()
    this.setState({
      notifications: [...pendingNotifications, readyNotification],
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


var MockNewMatchNotification = {
  action: 'retrieve',
  match_id: 1666,
  initiator_id: '#<User:0x007fcf01a712a0>',
  closer_id: 450,
  type:'match',
  alert: 'New Match',
  users:{
    302:{
      id:302,
      firstname:'Carl ',
      gender:'m',

      bio:null,height:null,body_type:null,age:23,image_url:'https://trippple-user.s3.amazonaws.com/test/uploads/images/302/0fc0255e3-original.jpeg','thumb_url':'https://trippple-user.s3.amazonaws.com/test/uploads/images/302/thumb_0fc0255e3-original.jpeg',
      couple:{
        id:486,
        bio:null,
        image:null
      }
    },
    303:{
      id:303,
      firstname:'R',gender:'m',
      bio:null,height:null,body_type:null,age:20,
      image_url:'https://trippple-user.s3.amazonaws.com/test/uploads/images/303/bcf060342-original.jpeg',
      thumb_url:'https://trippple-user.s3.amazonaws.com/test/uploads/images/303/thumb_bcf060342-original.jpeg',
      couple:{id:486,
        bio:null,image:null}},
    450:{id:450,firstname:'AleXANDER',gender:'Male',bio:'The fact I can get we wall w to be get on it for me a good day for me a lot more of an eye on out of a my this is one of those my phone and I it was not immediately available for comment on a Saturday night in a statement issued by by the end of the day before my eyes out and about a week year and I don\'t think know what ',height:'11',body_type:'A Little Extra',age:22,image_url:'https://trippple-user.s3.amazonaws.com/test/uploads/images/450/88165867a-12original.jpg',
    thumb_url:'https://trippple-user.s3.amazonaws.com/test/uploads/images/450/thumb_88165867a-12original.jpg'}},
  isFavourited:false,created_timestamp:1444913864,recent_message:{created_timestamp:null}
}
