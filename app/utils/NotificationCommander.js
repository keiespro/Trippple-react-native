window.navigator.userAgent = 'react-native' // socketio-client

import config from '../config'
const {WEBSOCKET_URL}  = config;
import React from 'react-native'
import { Component, View, AlertIOS, AsyncStorage, AppStateIOS, PushNotificationIOS, VibrationIOS } from 'react-native'

import io from 'socket.io-client/socket.io'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'
import colors from './colors'

import reactMixin from 'react-mixin'

class NotificationCommander extends Component{
  constructor(props){
    super()

    this.state = {
      appState: AppStateIOS.currentState,
      socketConnected: false,
      notifications: [],
      processing:false
    }
    this.socket = io(WEBSOCKET_URL, {jsonp:false})
  }

  componentDidMount(){
    PushNotificationIOS.addEventListener('notification', this._onPushNotification.bind(this) )

    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this) );
    if(this.props.api_key && this.props.user_id){
      this.connectSocket()
    }
    const newNotification = PushNotificationIOS.popInitialNotification()
    if(newNotification){
      this.handlePushData(newNotification)
    }
  }

  componentWillUnmount(){
    PushNotificationIOS.removeEventListener('notification', this._onPushNotification.bind(this) )

    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this) );
  }

  componentDidUpdate(prevProps,prevState){
    if(!prevProps.api_key && this.props.api_key && !prevState.socketConnected){
      this.connectSocket()
    }

    if(this.state.processing && !prevState.processing){
      this.setTimeout(()=>{
        this.setState({processing:false})
      },500)
    }

  }

  _onPushNotification(pushNotification){
    this.handlePushData(pushNotification)
  }

  handlePushData(pushNotification){
    if(!pushNotification){ return false }
    Log('Push notification',pushNotification)

    const data = pushNotification.getData();

    if(!data.action){ /* shot a blank */}

    if(data.action === 'retrieve' && data.type == 'potentials') {

      MatchActions.getPotentials()

    }else if(data.action === 'retrieve' && data.match_id) {

      // NotificationActions.receiveNewMatchNotification(data,true)
      VibrationIOS.vibrate()
      MatchActions.getMatches()
      AppActions.updateRoute({route:'chat',match_id: data.match_id,})
      NotificationActions.updateBadgeNumber.defer(-1)

    }else if(data.action === 'chat' && data.match_id){

      // NotificationActions.receiveNewMessageNotification(data,true)
      VibrationIOS.vibrate()
      MatchActions.getMessages(data.match_id)
      AppActions.updateRoute({route:'chat',match_id: data.match_id,})
      NotificationActions.updateBadgeNumber.defer(-1)

    }else if(data.action === 'notify') {
      VibrationIOS.vibrate()
      AlertIOS.alert(data.title, JSON.stringify(data.body));

    }else if(data.action === 'match_removed'){

      NotificationActions.receiveMatchRemovedNotification(data)

    }else if(data.action && data.action == 'coupleready') {

      UserActions.getUserInfo.defer()
      AlertIOS.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
      VibrationIOS.vibrate()

    }else if(data.action && data.action == 'statuschange') {

      UserActions.getUserInfo.defer()

    }else if(data.action == 'logout'){

      UserActions.logOut()

    }
      // AlertIOS.alert('APN Push Notification',JSON.stringify(pushNotification.getData()));
  }
  _handleAppStateChange(appState){
    if(appState === 'active'){
      const newNotification = PushNotificationIOS.popInitialNotification();
      if(newNotification){
        this.handlePushData(newNotification)
      }
    }
    this.setState({ appState });

  }
  connectSocket(){
    this.socket.on('user.connect', (data) => {
      this.online_id = data.online_id;

      const myApikey = this.props.api_key,
            myID = this.props.user_id;

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey}:${myID}`)
      });

      this.setState({socketConnected:true})
    })


    this.socket.on('system', (payload) => {

      this.setState({processing:true});
      const { data } = payload;

      if(data.action && data.action === 'retrieve' && data.match_id) {

        NotificationActions.receiveNewMatchNotification(data)

      }else if(data.action === 'match_removed'){

        NotificationActions.receiveMatchRemovedNotification(data)

      }else if(data.action && data.action == 'statuschange') {

        UserActions.getUserInfo.defer()

      }else if(data.action && data.action == 'coupleready') {
        UserActions.getUserInfo.defer()
        AlertIOS.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');

      }else if(data.action && data.action === 'logout') {

        UserActions.logOut()
      }

    })

    this.socket.on('chat', (payload) => {

      this.setState({processing:true});

      NotificationActions.receiveNewMessageNotification(payload)

    })

  }

  disconnectSocket(){
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey}:${user_id}`
    });

    this.socket.removeAllListeners()
    this.setState({socketConnected:false})
  }



  render(){
    const devStyles =  {
      position:'absolute',
      top:0,
      left:0,
      width: this.state.processing ? 5 : 2,
      height: this.state.processing ? 5 : 2,
      borderRadius: 1,
      backgroundColor: this.state.socketConnected ? colors.sushi : colors.mandy
    };

    const noStyles = {
      top:0,
      left:0,
      width:0,
      height:0,
    }

    return <View style={ __DEV__ ? devStyles : noStyles} />
  }

}

reactMixin(NotificationCommander.prototype,TimerMixin)


export default NotificationCommander
