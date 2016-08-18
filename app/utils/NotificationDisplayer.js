
import React from "react";
import { Component } from "react";
import { View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS } from "react-native";

// import Promise from 'bluebird'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'

import reactMixin from 'react-mixin'

class NotificationDisplayer extends Component {
  constructor(props) {
    super()
    this.state = {
    }

  }
  // shouldComponentUpdate(nextProps){
  //   return nextProps.notifications.length < 1 || this.props.notifications.length > 0 || this.props.notifications[0] && this.props.notifications[0].match_id != nextProps.notifications[0].match_id
  // }

  render() {
    const {notifications} = this.props
    if (!notifications) return <View/>
    var AppState = this.props.AppState || {
      currentRoute: {}
    };
    var check = AppState.currentRoute && AppState.currentRoute.title && AppState.currentRoute.title.toUpperCase() && this.props.notifications[0] || null;
    var isCurrentMatch = check && (AppState.currentRoute.title == 'CHAT' && AppState.currentRoute.match_id && AppState.currentRoute.match_id == notifications[0].match_id);

    return (
      <View>
        {notifications[0] && !isCurrentMatch && <Notification user={this.props.user} key={'noti' + notifications[0].match_id} payload={notifications[0]} />}
      </View>

    )
    //     return (
    //       <View>
    //       {notifications.map((noti,i)=>{
    //         return (<View style={{top:i*10}}><Notification
    //           user={this.props.user}
    //           key={'noti'+i}
    //           index={i}
    //           payload={notifications[i]}
    //         /></View>) })
    //       }
    //       </View>
    //     )

  }
}
reactMixin(NotificationDisplayer.prototype, TimerMixin)
export default NotificationDisplayer
