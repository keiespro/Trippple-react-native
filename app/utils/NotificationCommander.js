window.navigator.userAgent = '' // socketio-client

const TRIPPPLE_WEBSOCKET_URL = 'http://x.local:9919'

import React from 'react-native'
import { Component, View, AlertIOS, AsyncStorage, AppStateIOS, PushNotificationIOS, VibrationIOS } from 'react-native'

import Promise from 'bluebird'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import Notification from './NotificationTop'

const checkPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)

class NotificationCommander extends Component{

  constructor(props){
    super(props)

    this.state = {
      appState: AppStateIOS.currentState,
      notifications: []
    }

    this.socket = require('socket.io-client/socket.io')(TRIPPPLE_WEBSOCKET_URL, {jsonp:false})

  }

  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange);
    this.connectSocket()
  }

  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  }

  shouldComponentUpdate = () => false

  _handleAppStateChange =(appState)=> {
    appState === 'background' ? this.disconnectSocket() : this.connectSocket()
    this.setState({ appState });

  }

  connectSocket =()=> {
    this.socket.on('user.connect', (data) => {
      this.online_id = data.online_id;
      let myApikey = this.props.apikey
      let myID = this.props.user_id

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey || 'xxx'}:${myID}`)
      })
    })


    this.socket.on('system', (payload) => {

      let { data } = payload

      if(data.action && data.action === 'retrieve' && data.match_id) {
        console.log('NOTIFICATION');

      }else if(data.action === 'match_removed'){
        console.log('MATCH REMOVED');

      }else if(data.action && (data.action === 'imageflagged' || 'statuschange')) {

      }
    })

    this.socket.on('chat', (payload) => {

      let { data } = payload

      if(data.action === 'retrieve') {
        MatchActions.getMessages(data.match_id)
      }
    })

  }

  disconnectSocket =( )=> {
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey || 'xxx'}:${user_id}`
    });
    this.socket.removeAllListeners()
  }

  onNotification(){

    //TODO: write code here
    VibrationIOS.vibrate()
  }

  render(){

      if(this.state.notifications.length){
        return (
          <Notification />
        )
      }else{
        return null
      }
  }

}


export default NotificationCommander
