
// import PushNotification from 'react-native-push-notification'
import FCM from 'react-native-fcm';

import { connect } from 'react-redux';
import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';
import uuid from 'uuid'
import colors from './colors'
import Analytics from './Analytics'
import config from '../../config'
import ActionMan from '../actions/';


const iOS = Platform.OS == 'ios';

const {WEBSOCKET_URL} = config;
// const io = require('./socket.io')


@withNavigation
class NotificationCommander extends Component{
  constructor(){
    super()

    this.state = {
      socketConnected: false,
      notifications: [],
      processing: false,
    }
    // this.socket = io(WEBSOCKET_URL, {
    //   jsonp: false,
    //   transports: ['websocket'],
    //   // ['force new connection']: true
    // })
  }
  componentDidMount(){
    const dispatch = this.props.dispatch.bind(this);
    const handleAction = this.handleAction.bind(this);


    FCM.on('notification', (notification) => {
      console.log(notification);
      handleAction(notification, notification.foreground, notification.opened_from_tray)
      Analytics.event('Handle push notification', {action: JSON.stringify(notification)})
      __DEV__ && console.log('NOTIFICATION:', notification);
    });

    FCM.on('refreshToken', (token) => {
      __DEBUG__ && console.warn('TOKEN:', token);
      dispatch(ActionMan.receivePushToken(token))
      dispatch(ActionMan.updatePushToken(token))
    });

    FCM.getFCMToken().then(token => {
      __DEBUG__ && console.warn('TOKEN:', token);
      dispatch(ActionMan.receivePushToken(token))
      dispatch(ActionMan.updatePushToken(token))

        // store fcm token in your server
    });


    const creds = global.creds || {};

    // if (creds.api_key && creds.user_id){
    //   this.connectSocket()
    // }
  }

  // componentWillReceiveProps(nProps){
  //   if (!this.state.socketConnected && nProps.auth.api_key){
  //     this.connectSocket()
  //   }
  // }

  // connectSocket(){
  //   if (this.state.socketConnected) return;
  //   this.setState({socketConnected: true})
  //   __DEV__ && console.log('WEBSOCKET CONNECT ->');
  //
  //   this.socket.on('connect_error', (err) => {
  //     __DEV__ && console.log('SOCKETIO CONNECT ERR', err);
  //   });
  //
  //   this.socket.on('error', (err) => {
  //     __DEV__ && console.log('SOCKETIO ERR', err);
  //   });
  //   this.socket.on('user.disconnect', (data) => {
  //     this.props.dispatch({type: 'WEBSOCKET_CONNECTED', payload: data})
  //   });
  //
  //   this.socket.on('user.connect', (data) => {
  //     __DEV__ && console.log('WEBSOCKET CONNECTED !')
  //     this.props.dispatch({type: 'WEBSOCKET_CONNECTED', payload: data})
  //     this.online_id = data.online_id;
  //
  //     const myApikey = global.creds.api_key;
  //     const myID = global.creds.user_id;
  //
  //     this.socket.emit('user.connect', {
  //       online_id: data.online_id,
  //       api_uid: (`${myApikey}:${myID}`)
  //     });
  //     __DEV__ && console.log('WEBSOCKET CONNECTED')
  //   })
  //
  //   this.socket.on('system', (payload) => {
  //     __DEV__ && console.log('WEBSOCKET system', payload);
  //     Analytics.event('Webocket notification', {action: payload.data.action, label: 'system'})
  //     this.handleAction({...payload, label: payload.data.alert ? payload.data.alert.replace(' ', '') : payload.action})
  //   })
  //
  //   this.socket.on('chat', (payload) => {
  //     __DEV__ && console.log('WEBSOCKET chat', payload);
  //     Analytics.event('Webocket notification', {action: 'New Message', label: 'NewMessage'})
  //     this.handleAction({...payload, label: 'NewMessage'})
  //   })
  // }

  openChat(match_id){
    this.props.navigator.push(this.props.navigator.navigation.router.getRoute('Chat', {match_id}))
  }

  handleAction(notification){


    const moreNotificationAttributes = {
      uuid: uuid.v4(),
      receivedAt: Date.now(),
      viewedAt: null,
    }
    const newNotification = {...notification, ...moreNotificationAttributes }

    this.props.dispatch({type: 'RECEIVE_NOTIFICATION', payload: newNotification});

    if(notification.type == 'dispatch'){
      this.props.dispatch(ActionMan[notification.action_creator](notification.action_payload));
    }



    this.props.handleNotification(newNotification);
  }

  //
  // disconnectSocket(){
  //   const {apikey, user_id} = this.props
  //
  //   this.socket.emit('user.disconnect', {
  //     online_id: this.online_id,
  //     api_uid: `${apikey}:${user_id}`
  //   });
  //   __DEV__ && console.log('WEBSOCKET DISCONNECTED')
  //
  //   this.socket.removeAllListeners()
  //   this.setState({socketConnected: false})
  // }

  render(){
    if (!__DEV__) return false;

    const devStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.state.processing ? 5 : 2,
      height: this.state.processing ? 5 : 2,
      borderRadius: 1,
      backgroundColor: this.state.socketConnected ? colors.sushi : colors.mandy
    };

    return <View style={devStyles} />
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
    handleNotification: (n) => dispatch(ActionMan.handleNotification(n)),
    dispatch
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationCommander);
