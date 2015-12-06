/* @flow */

import React, { Image, TouchableOpacity, PushNotificationIOS, View, StyleSheet, Text, Animated, Dimensions, VibrationIOS, AlertIOS } from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../utils/colors'
import {BlurView} from 'react-native-blur';
import Overlay from 'react-native-overlay'
import NotificationActions from '../flux/actions/NotificationActions'
import AppActions from '../flux/actions/AppActions'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class Notification extends React.Component{

  constructor(props){
    super()

    this.state = {
      yValue: new Animated.Value(-220)
    }

  }

  componentDidMount() {
    this.state.yValue.setValue(0);

    VibrationIOS.vibrate()

    Animated.timing(this.state.yValue, {
      toValue: 0,
      duration: 200,
    }).start((fin)=>{})

    // this.setTimeout(()=>{
    //   Animated.timing(this.state.yValue, {
    //     toValue: -220,
    //     duration: 200,
    //   }).start()
    // },3000)

  }
  // componentDidUpdate(pProps,pState){

  // }
  tapNotification(e){

    Animated.timing(this.state.yValue, {
      toValue: -220,
      duration: 200,
    }).start()

    AppActions.updateRoute({route:'chat',match_id:this.props.payload.match_id,})
    NotificationActions.updateBadgeNumber.defer(-1)

  }

  render(){

    if(!this.props.payload) { return  }

    const { payload } = this.props;

    return (
      <Animated.View style={[styles.notificationWrapper,
        {
          transform: [{
            translateY: this.state.yValue
          }],
        }
        ]}>

        {payload.type == 'message' ?
          <View style={[styles.notificationOverlay,styles.notificationNewMessage]}>
            <TouchableOpacity onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
                <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={styles.notiImage}
                    defaultSource={{uri:'../../newimg/placeholderUserWhite.png'}}
                    source={{uri: payload.from_user_info.image_url}}
                  />
                </View>
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle,styles.titleNewMessage]}>{
                    payload.from_user_info.name.toUpperCase()
                  }</Text>
                  <Text style={styles.notiText} numberOfLines={2}>{ payload.message_body}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> : null
        }

        {payload.type == 'match' ?
          <View style={[styles.notificationOverlay,styles.notificationNewMatch]}>
            <TouchableOpacity onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
                <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={styles.notiImage}
                    defaultSource={{uri:'../../newimg/placeholderUserWhite.png'}}
                    source={{uri: null}}
                  />
                </View>
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle,styles.titleNewMatch]}>IT'S A MATCH!</Text>
                  <Text style={styles.notiText}>{`matchName  likes you back!`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> : null
        }
      </Animated.View>
    )
  }
}

export default Notification


var styles = StyleSheet.create({
  notificationWrapper:{
    width: DeviceWidth,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor:'transparent',
    height:88,
    overflow:'hidden'
  },
  notificationOverlay: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  notificationNewMessage:{
    backgroundColor:colors.mediumPurple,

  },
  notificationNewMatch:{
    backgroundColor:colors.sushi,

  },
  notificationLeft:{
    width:60
  },
  notificationRight:{
    flex:1
  },

  notiText: {
    color:colors.white,
    fontFamily:'omnes',
    fontSize:16
  },

  notiTitle: {
    fontFamily:'Montserrat',
    fontSize:14

  },
  titleNewMessage:{
    color:colors.lavender,
  },
  titleNewMatch:{
    color:colors.sashimi,
  },
  notificationInside:{
    flex:1,
    flexDirection:'row',
    width:DeviceWidth,
    padding:15
  },
  notiImage:{
    width:50,
    height:50,
    overflow:'hidden',
    borderRadius: 25,
    borderWidth: 0,
    backgroundColor:colors.dark
  }

})
