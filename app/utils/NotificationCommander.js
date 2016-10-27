
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
      notifications: [],
      processing: false,
    }
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
      if(token != this.props.pushToken) dispatch(ActionMan.receivePushToken(token))
    });

    FCM.getFCMToken().then(token => {
      __DEBUG__ && console.warn('TOKEN:', token);
      if(token != this.props.pushToken) dispatch(ActionMan.receivePushToken(token))

        // store fcm token in your server
    });

  }

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
    notifications: state.notifications,
    pushToken: state.device.push_token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleNotification: (n) => dispatch(ActionMan.handleNotification(n)),
    dispatch
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificationCommander);
