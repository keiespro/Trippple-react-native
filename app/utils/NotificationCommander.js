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
const checkPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)

@reactMixin.decorate(TimerMixin)
class NotificationCommander extends Component{
  constructor(props){
    super(props)

    this.state = {
      appState: AppStateIOS.currentState,
      socketConnected: false,
      notifications: []
    }

    this.socket = require('socket.io-client/socket.io')(WEBSOCKET_URL, {jsonp:false})
  }

  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange);
    if(this.props.api_key && this.props.user_id){
      this.connectSocket()
    }
  }

  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  }
  componentDidUpdate(prevProps,prevState){
    if(!prevProps.api_key && this.props.api_key && !prevState.socketConnected){
      this.connectSocket()
    }
  }
  // componentWillReceiveProps(nextProps){
  //   if(!this.props.api_key && nextProps.api_key){
  //     this.connectSocket()
  //   }
  // }
  // shouldComponentUpdate = () => false

  _handleAppStateChange =(appState)=> {
    // appState === 'background' ?  this.connectSocket()
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

      }else if(data.action && (data.action === 'imageflagged' || 'statuschange')) {



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

  onNotification(){
    //TODO: write code here
    VibrationIOS.vibrate()
  }


  render(){
    return null
  }

}


export default NotificationCommander
