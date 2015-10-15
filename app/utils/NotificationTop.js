
import React from 'react-native'
import { Image,TouchableOpacity, Component, View, StyleSheet, Text, Animated, Dimensions,LayoutAnimation,VibrationIOS } from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../utils/colors'
import {BlurView} from 'react-native-blur';
import Overlay from 'react-native-overlay'

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

@reactMixin.decorate(TimerMixin)
class Notification extends Component{

  constructor(props){
    super(props)

    this.state = {
      yValue: -220
    }

  }

  componentWillMount() {
    console.log('notification top')
  }
  componentDidMount(){

    this.setState({yValue:0})
    VibrationIOS.vibrate()

  }
  componentWillUpdate(){
            LayoutAnimation.configureNext(animations.layout.spring);

  }
  componentWillUnmount(){
            LayoutAnimation.configureNext(animations.layout.spring);


  }

  render(){
    console.log(this.props.payload)
    if(!this.props.payload){return false}
    return (
      <View style={[styles.notificationWrapper,
        {
          transform: [{
            translateY: this.state.yValue
          }]
        }
        ]}>
        <BlurView blurType="light" style={[styles.notificationOverlay]}>


        {this.props.payload.type == 'message' ?
          <TouchableOpacity onPress={(e)=>{console.log(e)}}>
          <View style={{flex:1,flexDirection:'row',width:DeviceWidth,padding:20}}>
            <View style={styles.notificationLeft}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={styles.notiImage}
              defaultSource={require('image!defaultuser')}
              source={{uri: this.props.payload.from_user_info.image_url}}
            />
            </View>
            <View style={styles.notificationRight}>
              <Text style={styles.notiTitle}>{this.props.payload.from_user_info.name}</Text>
              <Text style={styles.notiText}>{this.props.payload.message_body}</Text>
           </View>
           </View>
           </TouchableOpacity> : null
        }

       {this.props.payload.type == 'match' ?
          <TouchableOpacity onPress={(e)=>{
              console.log(e)

            }}>
          <View style={{flex:1,flexDirection:'row',width:DeviceWidth,padding:20}}>
            <View style={styles.notificationLeft}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={styles.notiImage}
              source={{uri: this.props.user.relationship_status == 'single' ? this.props.payload.thumb_url : this.props.payload.users['450'].thumb_url}}
            />
            </View>
            <View style={styles.notificationRight}>
              <Text style={styles.notiTitle}>New Match!</Text>
              <Text style={styles.notiText}>{this.props.payload.id}</Text>
           </View>
           </View>
           </TouchableOpacity> : null
        }

        </BlurView>
      </View>

    )
  }
}

export default Notification


var animations = {
  layout: {
    spring: {
      duration: 300,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};


var styles = StyleSheet.create({
  notificationWrapper:{
    height:120,
    width:DeviceWidth,
    flex: 1,
    position:'absolute',
    top:0,
    left:0,
    right:0,
    backgroundColor:'transparent',
  },
  notificationOverlay: {
    backgroundColor:'transparent',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  notificationLeft:{
    width:80
  },
  notificationRight:{
    flex:1
  },

  notiText: {
    color:colors.outerSpace,
    fontFamily:'omnes',
    fontSize:22
  },

  notiTitle: {
    color:colors.outerSpace,
    fontFamily:'omnes',
    fontWeight:'500',

  },
  notiImage:{
    width:60,
    height:60,
    overflow:'hidden',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.white
  }

})
