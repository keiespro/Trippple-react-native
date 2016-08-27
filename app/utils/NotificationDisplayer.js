
import React from "react";
import { Component } from "react";
import { View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS } from "react-native";

// import Promise from 'bluebird'
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'
import { connect } from 'react-redux';

import reactMixin from 'react-mixin'

class NotificationDisplayer extends Component {
  constructor(props) {
    super()
    this.state = {
    }

  }

  render() {
    const {notifications} = this.props
    if (!notifications) return <View/>
    // AppState.currentRoute && AppState.currentRoute.title && AppState.currentRoute.title.toUpperCase() &&
    var check =  this.props.notifications[0] || null;
    // var isCurrentMatch = check && (AppState.currentRoute.title == 'CHAT' && AppState.currentRoute.match_id && AppState.currentRoute.match_id == notifications[0].match_id);
//!isCurrentMatch &&
    return (
      <View>
        {notifications[0] &&
          <Notification
            user={this.props.user}
            key={'noti'}
            notification={notifications[0]}
            dispatch={this.props.dispatch}
          />
        }
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


const mapStateToProps = (state, ownProps) => {
  // console.log('state',state,'ownProps',ownProps); // state
  return { notifications: state.notifications, user: state.user}
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDisplayer);
