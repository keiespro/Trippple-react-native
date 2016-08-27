'use strict';

import React from "react";

import {Image, TouchableHighlight,TouchableOpacity,PanResponder, Easing,StatusBar,PushNotificationIOS, View, StyleSheet, Text, Animated, Dimensions, VibrationIOS, Alert} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../utils/colors'
import {BlurView} from 'react-native-blur';
import Overlay from 'react-native-overlay'

class Notification extends React.Component{

  constructor(props){
    super()

    this.state = {
      yValue: new Animated.Value(-220),
      pan: new Animated.ValueXY(),

    }
    this._panResponder = {}
  }
  componentWillMount(){
    __DEV__ && VibrationIOS.vibrate()
  }

  componentDidMount() {
    this.state.pan.setValue({x: 0, y: 0});

    Animated.timing(this.state.pan, {
      toValue: 0,
      duration: 200,
    }).start((fin)=>{
      this.initializePanResponder();
      this.setState({inPlace:true})

    })
    // Alert.alert('alert',JSON.stringify(this.props))

  }


  initializePanResponder(){
    delete this._panResponder

    this._panResponder = PanResponder.create({
      //
      // onMoveShouldSetPanResponderCapture: (e,gestureState) => {
      //     // console.log('onMoveShouldSetPanResponderCapture',gestureState)
      //   return true;
      // },
      onMoveShouldSetPanResponder: (e,gestureState) => {
          // console.log('onMoveShouldSetPanResponder',gestureState)
        return true//isVertical(gestureState))
          // return !this.props.profileVisible && notInCone(gestureState)
      },
      // onStartShouldSetPanResponder: (e,gestureState) => {
      //     // console.log('onStartShouldSetPanResponder',gestureState)
      //   return   true //isVertical(gestureState))
      // },
      // onStartShouldSetPanResponderCapture: (e,gestureState) => {
      //     // console.log('onStartShouldSetPanResponderCapture',gestureState)
      //   return  true;//!this.props.profileVisible && (isCouple ? true : isVertical(gestureState))
      // },
      onPanResponderReject: (e, gestureState) => {
          // console.log('onPanResponderReject',gestureState)
      },
      onPanResponderMove: Animated.event([null, {
        dy: this.state.pan.y,
        dx: this.state.pan.x
      }]),
      onPanResponderTerminate: (e, gestureState) => {
          // console.log('onPanResponderTerminate',gestureState)
      },
      onPanResponderTerminationRequest: (e, gestureState) => {
          // console.log('onPanResponderTerminationRequest',gestureState)
      },
      onPanResponderReject: (e, gestureState) => {
          // console.log('onPanResponderReject',gestureState)
      },
      onPanResponderGrant: (e, gestureState) => {
          // console.log('onPanResponderGrant',gestureState)
      },
      onPanResponderStart: (e, gestureState) => {
          // console.log('onPanResponderStart',gestureState)
      },
      onPanResponderEnd: (e, gestureState) => {
          // console.log('onPanResponderEnd',gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        const {dx,dy,vx,vy} = gestureState;
        console.log(dx,dy,vx,vy);
        Animated.timing(this.state.pan.y, {
          toValue: vy > 0 && dy > 10 ? 0 : -200,
          easing: Easing.out(Easing.exp),
          duration: 150,
        }).start((fin)=>{

        })
      }
    })
  }
  tapNotification(e){
    console.log('tap');

    Animated.timing(this.state.yValue, {
      toValue: -220,
      duration: 100,
    }).start(()=>{
      // AppActions.updateRoute({notification:true,route:'chat',match_id:this.props.payload.match_id,})
      // this.setState({tapped:true})

    })

    // NotificationActions.updateBadgeNumber.defer(-1)

  }

  render(){
    console.log(this.props.payload);

    if(!this.props.payload) {

      return false
    }

    const { payload, user } = this.props;

    payload.data = payload['0'] ? payload['0'].data ? payload['0'].data : payload['0'] : payload.data
    let myPartnerId;
    let theirIds;
    let them;
    let threadName;
    let matchName;


    if(payload.type == 'match'){
      // if(!payload.users && (payload.data && !payload.data.users)){ return false}

      myPartnerId = user.relationship_status === 'couple' ? user.partner_id : null;
      theirIds = Object.keys(payload.users).filter( (u)=> u != user.id && u != user.partner_id);
      them = theirIds.map((id)=> payload.users[id]);
      threadName = them.map( (u,i) => u.firstname.trim() ).join(' & ');
      matchName = threadName + (theirIds.length > 1 ? ' like ' : ' likes ');
    }
    // if(!matchName || this.state.tapped){
    //   return false
    // }
    return (
      <Animated.View
      { ...this._panResponder.panHandlers}
        style={[styles.notificationWrapper,
          {
            height: this.state.inPlace ? this.state.pan.y.interpolate({
              inputRange: [0, DeviceHeight/2, DeviceHeight],
              outputRange: [80, DeviceHeight/4, DeviceHeight/4],
              extrapolate: 'clamp'
            }) : 80,
            transform: [{
              translateY: this.state.inPlace ? this.state.pan.y.interpolate({
                inputRange: [-80,  0, DeviceHeight],
                outputRange: [-80, 0, 10]
              }) : this.state.yValue
            }],
            justifyContent:'flex-end'

          },
          styles[payload.type]
        ]}>
        <StatusBar animated={true} barStyle="light-content" hidden={true} />

        {payload.type == 'message' ?
          <View style={[styles.notificationOverlay,styles.notificationNewMessage]}>
            <TouchableOpacity onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
                <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={styles.notiImage}
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
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
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                    source={{uri: them[0].thumb_url}}
                  />
                </View>
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle,styles.titleNewMatch]}>IT'S A MATCH!</Text>
                  <Text style={styles.notiText}>{`${matchName} you back!`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> : null
        }


        {payload.type == 'display' ?
             <TouchableHighlight style={[styles.notificationOverlay]} onPress={this.tapNotification.bind(this)}>
              <View style={styles.notificationInside}>
              {payload.image_url &&  <View style={styles.notificationLeft}>
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={styles.notiImage}
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                    source={{uri: payload.image_url}}
                  />
                </View>}
                <View style={styles.notificationRight}>
                  <Text style={[styles.notiTitle,styles.titleNewMessage]}>{
                    payload.title
                  }</Text>
                  <Text style={styles.notiText} numberOfLines={2}>{ payload.body}</Text>
                </View>
              </View>
            </TouchableHighlight>  : null
        }

      </Animated.View>
    )
  }
}

export default Notification


const styles = StyleSheet.create({
  notificationWrapper:{
    width: DeviceWidth-14,
    flex: 1,
    position: 'absolute',
    borderRadius:8,
    top: 7,
    left: 7,
    right: 7,
    backgroundColor:'transparent',
    height:88,
    shadowColor: '#222',
    shadowOffset: {
      width:0,
      height: 4
    },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  notificationOverlay: {
    flexDirection:'row',
    flex:1,
    borderRadius:8,

    overflow:'hidden',
    justifyContent:'space-between'
  },
  message:{
    backgroundColor:colors.mediumPurple,

  },
  match:{
    backgroundColor:colors.sushi,

  },
  danger:{
    backgroundColor:colors.mandy,

  },
  display:{
    backgroundColor:colors.shuttleGray,

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
