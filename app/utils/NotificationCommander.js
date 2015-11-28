window.navigator.userAgent = '' // socketio-client

import {WEBSOCKET_URL} from '../config'

import React from 'react-native'
import { Component, View, AlertIOS, AsyncStorage, AppStateIOS, PushNotificationIOS, VibrationIOS } from 'react-native'

import Promise from 'bluebird'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'

import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class NotificationCommander extends Component{
  constructor(props){
    super()

    this.state = {
      appState: AppStateIOS.currentState,
      socketConnected: false,
      notifications: []
    }

    this.socket = require('socket.io-client/socket.io')(WEBSOCKET_URL, {jsonp:false})
  }

  componentDidMount(){
    PushNotificationIOS.checkPermissions((permissions) => {
      if(permissions){
        PushNotificationIOS.addEventListener('notification', this._onPushNotification )
      }
    })
    AppStateIOS.addEventListener('change', this._handleAppStateChange );
    if(this.props.api_key && this.props.user_id){
      this.connectSocket()
    }

 }

  componentWillUnmount(){
    PushNotificationIOS.removeEventListener('notification', this._onPushNotification)

    AppStateIOS.removeEventListener('change', this._handleAppStateChange );
  }
  componentDidUpdate(prevProps,prevState){
    if(!prevProps.api_key && this.props.api_key && !prevState.socketConnected){
      this.connectSocket()
    }
  }

  _onPushNotification =(pushNotification)=>{
    console.log('pushNotification! pushNotification!',pushNotification)
    VibrationIOS.vibrate()
    this.handlePushData(pushNotification)
  }

  handlePushData(pushNotification){
    console.log('handlePushData',pushNotification)

    if(!pushNotification || !pushNotification.data){
      console.log(pushNotification, 'This notification is empty?');
      return false
    }

    if(data.action && data.action === 'retrieve' && data.match_id) {

      NotificationActions.receiveNewMatchNotification(data)

    }else if(data.action === 'chat'){

      NotificationActions.receiveNewMessageNotification(data)

    }else if(data.action === 'logout'){

          UserActions.logOut()

    }


  }
  _handleAppStateChange =(appState)=> {
    if(appState === 'active'){
      const newNotification = PushNotificationIOS.popInitialNotification()
      this.handlePushData(newNotification)
    }
    this.setState({ appState });

  }

  connectSocket =()=> {
    this.setState({socketConnected:true})
    this.socket.on('user.connect', (data) => {
      this.online_id = data.online_id;
      const myApikey = this.props.api_key
      const myID = this.props.user_id

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey}:${myID}`)
      })

    })


    this.socket.on('system', (payload) => {
      console.log('system NOTIFICATION',payload)

      const { data } = payload

      if(data.action && data.action === 'retrieve' && data.match_id) {

        NotificationActions.receiveNewMatchNotification(data)

      }else if(data.action === 'match_removed'){

        NotificationActions.receiveMatchRemovedNotification(data)

      }else if(data.action && (data.action === '???') || 'statuschange') {



      }else if(data.action && data.action === 'retrieve' && data.userInfo == true) {
          console.log('FETCH USER INFO!!!!!')


      }else if(data.action && data.action === 'logout') {
          console.log('FORCE LOG OUT!!!!!')

          UserActions.logOut()
      }
    })

    this.socket.on('chat', (payload) => {
      console.log('CHAT NOTIFICATION',payload)

      NotificationActions.receiveNewMessageNotification(payload)

    })

  }

  disconnectSocket =( )=> {
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey}:${user_id}`
    });
    this.socket.removeAllListeners()
    this.setState({socketConnected:false})
  }



  render(){

    return <View/>
  }

}


export default NotificationCommander
