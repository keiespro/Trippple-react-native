
import React, {Component} from "react";
import {View, Dimensions, NativeModules, Image, Animated, Text, TouchableOpacity} from "react-native";

import colors from '../utils/colors'
import Analytics from '../utils/Analytics'

import AppActions from '../flux/actions/AppActions'

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../DeviceConfig'
import AppTelemetry from '../AppTelemetry'
const {RNMail} = NativeModules
import RNFS from 'react-native-fs'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;



class MaintenanceScreen extends Component{

  constructor(props){
    super();
    this.state = {
      buttonOpacity: new Animated.Value(0)
    }
  }
  componentWillMount(){

  }
  componentDidMount() {
    Analytics.event('Maintenance Screen',{label:'',action:'',eventData:{}})

      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 1.0,
          delay: 2000,
          duration:1000
        }
      ).start(()=>{})

  }
  handleFeedback(){
    AppActions.sendFeedback('MaintenanceScreen')

  }

  render(){
    return (

      <View
        style={{
          width:DeviceWidth,
          height:DeviceHeight,
          alignItems:'center',
          flexDirection:'column',
          top:0,
          left:0,
          backgroundColor:colors.dusk,
          position:'absolute',
          justifyContent:'center',
          flex:1
      }}>
        <Image
          style={{
            width:DeviceWidth,
            height:DeviceHeight,
            alignItems:'center',
            flexDirection:'column',
            top:0,
            left:0,
            position:'absolute',
            justifyContent:'center',
            flex:1,
          }}
          source={{uri:'https://blistering-torch-607.firebaseapp.com/system-maintenance.png'}}

          defaultSource={{uri:'assets/system-maintenance.png'}}
        >
          <View style={{
            width:DeviceWidth,
            height:100,
            alignItems:'center',
            flexDirection:'row',
            bottom:0,
            left:0,
            position:'absolute',
            justifyContent:'center',
            flex:1
          }}>
            <Animated.View
              style={{
                justifyContent:'center',
                flex:1,
                flexDirection:'row',
                opacity:this.state.buttonOpacity,
            }}>
              <Text style={{
                fontSize:16,
                backgroundColor:'transparent',
                textAlign:'left',
                color:colors.white,
              }}>Questions? Comments? </Text>
              <TouchableOpacity onPress={this.handleFeedback.bind(this)}>
                <Text style={{
                  fontSize:16,marginLeft:0.5,
                  backgroundColor:'transparent',
                  textAlign:'left',
                  color:colors.sushi,
                }}>Contact Us<Text style={{ color:colors.white }}>.</Text></Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Image>
      </View>
    )
  }
}

reactMixin(MaintenanceScreen.prototype, TimerMixin)

export default MaintenanceScreen
