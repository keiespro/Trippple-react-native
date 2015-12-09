
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
    super()

    this.state = {
    }

  }
  // shouldComponentUpdate(nextProps){
  //   return nextProps.notifications.length < 1 || this.props.notifications.length > 0 || this.props.notifications[0] && this.props.notifications[0].match_id != nextProps.notifications[0].match_id
  // }

  render(){
    return (
      <View>
      {this.props.notifications[0] && <Notification
          user={this.props.user}
          key={'noti'+this.props.notifications[0].match_id}
          payload={this.props.notifications[0]}
        />}
      </View>

    )
//     return (
//       <View>
//       {this.props.notifications.map((noti,i)=>{
//         return (<View style={{top:i*10}}><Notification
//           user={this.props.user}
//           key={'noti'+i}
//           index={i}
//           payload={this.props.notifications[i]}
//         /></View>) })
//       }
//       </View>
//     )

  }
}

export default NotificationDisplayer
