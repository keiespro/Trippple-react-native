
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation'
import React, { Component } from 'react'
import reactMixin  from 'react-mixin'
import { View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS } from 'react-native'
import { connect } from 'react-redux'
import TimerMixin  from 'react-timer-mixin'
import Notification  from './NotificationTop'
import _ from 'lodash'


class NotificationDisplayer extends Component {
  constructor(props) {
    super()
    this.state = {
      visible: true
    }

  }
  componentWillReceiveProps(nProps){
    // if(nProps.notifications && nProps.notifications[0] && this.props.notifications && this.props.notifications[0] && nProps.notifications[0].uuid != this.props.notifications[0].uuid){
      this.setState({ visible: true })
      this.setNotificationGoAwayTimer(1000)
    // }
  }
  setNotificationGoAwayTimer(ms=500){
    this.setTimeout(()=> {
      this.setState({ visible: false })
    },ms)
  }
  render() {
    const {notifications} = this.props;
    if (!notifications) return <View/>
     var check =  this.props.notifications[0] || null;

    return (
      <View>
        {notifications[0] &&
          <Notification
            setNotificationGoAwayTimer={this.setNotificationGoAwayTimer.bind(this)}
            user={this.props.user}
            key={`noti${notifications[0].uuid}`}
            visible={this.state.visible}
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
  return { ...ownProps, notifications: _.filter(state.notifications,(n) => { return n && !n.viewedAt}), user: state.user}
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDisplayer);
