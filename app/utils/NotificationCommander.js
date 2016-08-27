'use strict';

import ActionMan from  '../actions/';
import { connect } from 'react-redux';

import config from '../../config'
const {WEBSOCKET_URL} = config;
import React,{Component} from "react";

import {View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS} from "react-native";

const io = require('./socket.io')
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'
import colors from './colors'
import reactMixin from 'react-mixin'
import Analytics from './Analytics'

import PushNotification from 'react-native-push-notification'

class NotificationCommander extends Component{
  constructor(props){
    super()

    this.state = {
      socketConnected: false,
      notifications: [],
      processing:false,
    }
    this.socket = io(WEBSOCKET_URL, {
      jsonp:false,
      transports: ['websocket'],
      // ['force new connection']: true
    })

  }
  componentDidMount(){
    const dispatch = this.props.dispatch;
    const handleAction = this.handleAction;

    PushNotification.configure({
      onRegister(token) {
        __DEV__ && console.log( 'TOKEN:', token );
        dispatch(ActionMan.updateUser({push_token: token.token}))
      },
      onNotification(notification) {
        // {
        //   foreground: false, // BOOLEAN: If the notification was received in foreground or not
        //   userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
        //   message: 'My Notification Message', // STRING: The notification message
        //   data: {}, // OBJECT: The push data
        // }
        Analytics.event('Handle push notification',{action:JSON.stringify(notification)})

        console.log( 'NOTIFICATION:', notification );
        notification.data && handleAction(notification.data)
      },
      // senderID: "YOUR GCM SENDER ID", // ANDROID ONLY: (optional) GCM Sender ID.
      popInitialNotification: true,
      requestPermissions: false,
    });


    if(this.props.api_key && this.props.user_id){
      this.connectSocket()
    }
    PushNotification.checkPermissions((perms) => {
      if(perms.alert){
        PushNotificationIOS.requestPermissions().then(x => console.log(x))
      }
    })
  }

  connectSocket(){
    __DEV__ && console.log('WEBSOCKET CONNECT ->');

    this.socket.on('connect_error', (err) => {
      __DEV__ && console.log('SOCKETIO CONNECT ERR',err);
    });

    this.socket.on('error', (err) => {
      __DEV__ && console.log('SOCKETIO ERR',err);
    });

    this.socket.on('user.connect', (data) => {
      __DEV__ && console.log('WEBSOCKET CONNECTED !')

      this.online_id = data.online_id;

      const myApikey = this.props.api_key,
      myID = this.props.user_id;

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey}:${myID}`)
      });
      __DEV__ && console.log('WEBSOCKET CONNECTED')

      this.setState({socketConnected:true})
    })

    this.socket.on('system', (payload) => {

      Analytics.event('Webocket notification',{action: payload.data.action, label: 'system'})

      let tempData;
      if(typeof payload == 'object'){
        tempData = payload.data
      }else{
        tempData = JSON.parse(payload.data)
      }

      let data = tempData;
      this.setState({processing:true});

      this.handleAction(data)

    })

    this.socket.on('chat', (payload) => {
      __DEV__ && console.log('chat weboscket',payload);
      Analytics.event('Webocket notification',{action: 'New Message', label: 'chat'})

      this.setState({processing:true});
      this.handleAction(payload.data)

    })

  }
  openChat(match_id){
    this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('Chat', {match_id}))

  }
  handleAction(data){
      console.log(data);
      if(!data || !data.action){ return }

      if(data.action === 'retrieve' && data.type == 'potentials') {

        this.props.getPotentials()

      }else if(data.action === 'retrieve' && data.match_id) {

        this.props.receiveNewMatchNotification(data,true)
        this.props.getMatches()
        this.openChat()
        this.props.updateBadgeNumber(-1)

      }else if(data.action === 'chat' && data.match_id){

        this.props.receiveNewMessageNotification(data,true)
        this.props.getMessages(data.match_id)
        this.openChat()
        this.props.updateBadgeNumber(-1)
      }else if(data.action === 'notify') {
        VibrationIOS.vibrate()
        Alert.alert(data.title, JSON.stringify(data.body));

      }else if(data.action === 'match_removed'){

        this.props.receiveMatchRemovedNotification(data)
        // TODO: update to new

      }else if(data.action == 'coupleready') {
        // Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
        this.props.receiveCoupleCreatedNotification(data);

      }else if(data.action == 'decouple') {

        // Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
        this.props.receiveDecoupleNotification(data);

      }else if(data.action == 'statuschange' || data.action == 'imageflagged') {

        this.props.getUserInfo()

      }else if(data.action == 'logout'){

        this.props.logOut()

      }else if(data.action == 'report'){

        this.props.sendTelemetry()

      }else if(data.action === 'display') {

        this.props.receiveGenericNotification(data)
        // TODO: update to new

      }

    }


  disconnectSocket(){
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey}:${user_id}`
    });
    __DEV__ && console.log('WEBSOCKET DISCONNECTED')

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


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    auth: state.auth,
    notifications: state.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPotentials:                                          (p) => dispatch(ActionMan.getPotentials()),
    receiveNewMatchNotification:                            (p) => dispatch(ActionMan.receiveNewMatchNotification(p)),
    getMatches:                                             (p) => dispatch(ActionMan.getMatches()),
    receiveNewMessageNotification:                          (p) => dispatch(ActionMan.receiveNewMessageNotification(p)),
    getMessages:                                            (p) => dispatch(ActionMan.getMessages()),
    updateRoute:                                            (p) => dispatch(ActionMan.updateRoute(p)),
    updateBadgeNumber:                                      (p) => dispatch(ActionMan.updateBadgeNumber(p)),
    receiveMatchRemovedNotification:                        (p) => dispatch(ActionMan.receiveMatchRemovedNotification(p)),
    receiveCoupleCreatedNotification:                       (p) => dispatch(ActionMan.receiveCoupleCreatedNotification(p)),
    receiveDecoupleNotification:                            (p) => dispatch(ActionMan.receiveDecoupleNotification(p)),
    getUserInfo:                                            (p) => dispatch(ActionMan.getUserInfo()),
    logOut:                                                 (p) => dispatch(ActionMan.logOut()),
    sendTelemetry:                                          (p) => dispatch(ActionMan.sendTelemetry()),
    receiveGenericNotification:                             (p) => dispatch(ActionMan.receiveGenericNotification(p)),
    dispatch
  };
}
reactMixin(NotificationCommander.prototype,TimerMixin)

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCommander);
