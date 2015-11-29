
import React from 'react-native'
import { Image,TouchableOpacity, Component, View, StyleSheet, Text, Animated, Dimensions,LayoutAnimation,VibrationIOS } from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../utils/colors'
import {BlurView} from 'react-native-blur';
import Overlay from 'react-native-overlay'
import AppActions from '../flux/actions/AppActions'
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
            LayoutAnimation.spring();

  }
  componentDidMount(){

    this.setState({yValue:0})
    VibrationIOS.vibrate()

  }
  componentDidUpdate(){
            LayoutAnimation.spring();

  }
  componentWillUnmount(){
            LayoutAnimation.configureNext(animations.layout.spring);


  }

  render(){
    if(!this.props.payload){return false}
    const { payload } = this.props

    return (
      <View style={[styles.notificationWrapper,
        {
          transform: [{
            translateY: this.state.yValue
          }]
        }
        ]}>


        {this.props.payload.type == 'message' ?
          <View style={[styles.notificationOverlay,styles.notificationNewMessage]}>

          <TouchableOpacity onPress={(e)=>{
              this.setState({yValue:-220})
              AppActions.updateRoute({route:'chat',match_id:this.props.payload.match_id})
              }}>
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
              <Text style={[styles.notiTitle,styles.titleNewMessage]}>{this.props.payload.from_user_info.name.toUpperCase()}</Text>
              <Text style={styles.notiText}>{this.props.payload.message_body}</Text>
           </View>
           </View>
           </TouchableOpacity>

              </View>
           : null
        }

       {this.props.payload.type == 'match' ?
         <View style={[styles.notificationOverlay,styles.notificationNewMatch]}>
          <TouchableOpacity onPress={(e)=>{
              this.setState({yValue:-220})
              AppActions.updateRoute({route:'chat',match_id:this.props.payload.match_id,})
            }}>
          <View style={{flex:1,flexDirection:'row',width:DeviceWidth,padding:15}}>
            <View style={styles.notificationLeft}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={styles.notiImage}
              defaultSource={{uri:'../../newimg/placeholderUserWhite.png'}}
              source={{uri: payload.users[payload.closer_id].image_url}}

            />
            </View>
            <View style={styles.notificationRight}>
              <Text style={[styles.notiTitle,styles.titleNewMatch]}>IT'S A MATCH!</Text>
              <Text style={styles.notiText}>{payload.users[payload.closer_id].firstname} likes you back!</Text>
           </View>
           </View>
           </TouchableOpacity></View> : null
        }

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
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 20
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
    width: DeviceWidth,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor:'transparent',
    height:98,
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
