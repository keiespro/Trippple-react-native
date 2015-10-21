
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
class NotificationDisplayer extends Component{
  constructor(props){
    super(props)

    this.state = {
    }

  }
  componentWillReceiveProps(props){
    console.log('new props',props)
  }
  // shouldComponentUpdate(nextProps){
    // return this.props.notifications[0] !== nextProps.notifications[0]
  // }

  render(){
    return this.props.notifications[0] ?
      <Notification user={this.props.user} key={this.props.notifications[0]} payload={this.props.notifications[0]} /> : null

  }
}

export default NotificationDisplayer
