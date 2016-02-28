
import React, { Component, View, Dimensions,Navigator, Image, Text, TouchableOpacity } from 'react-native'

import colors from '../utils/colors'

import AppActions from '../flux/actions/AppActions'

import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../DeviceConfig'

import SelfImage from '../components/loggedin/SelfImage'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import ContinueButton from '../controls/ContinueButton'

class ImageFlagged extends Component{

  constructor(props){
    super();
    this.state = {
     }
  }

  selectScene(route, navigator){
    const RouteComponent = route.component;

    return (
      <View style={{ flex: 1,  width: DeviceWidth, height: DeviceHeight,top:0}}>
        <RouteComponent
          navigator={navigator}
          route={route}
          {...route.passProps}
          AppState={this.props.AppState}
        />
      </View>
    );
  }
  render(){
    return (
      <Navigator
        ref={'nav'}
        initialRoute={{
          component: WarningScreen,
          index: 0,
          id: 'potentials'
        }}
        configureScene={route => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}
        renderScene={this.selectScene.bind(this)}
      />
    )
  }
}


class WarningScreen extends Component{

  constructor(props){
    super();
    this.state = {
     }
  }
  handleContinue(){
    this.props.navigator.push({
      component: SelfImage
    });
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
          backgroundColor:colors.outerSpace,
          position:'absolute',
          justifyContent:'center',
          flex:1,
          padding:20,
          paddingBottom:80,
      }}>

      <Image style={{height:260,width:200, marginBottom:20}} resizeMode={'contain'} source={{uri:'https://blistering-torch-607.firebaseapp.com/shield@2x.png'}}/>
    <View>
       <Text   style={{
        fontSize:22,
        color:'#ffffff',
        marginVertical: 10,
        textAlign:'center',
        fontFamily:'Montserrat-Bold',
      }}>YOUR PIC HAS  BEEN FLAGGED</Text>
    <Text style={{
                  fontSize:18,
                  textAlign:'center',
                  color:colors.white,
                  marginBottom:40
                }}>This is the message that we type in to the Trippple admin.</Text>
                </View>
            <View
              style={{
                width:DeviceWidth,
                height:DeviceHeight,
                position:'absolute',
                bottom:0,left:0,right:0,
                height:80,
                backgroundColor:colors.mediumPurple
              }}>
              <ContinueButton customText={'UPLOAD A NEW PIC'} canContinue={true} handlePress={this.handleContinue.bind(this)}/>

            </View>
      </View>
    )
  }
}

reactMixin(ImageFlagged.prototype, TimerMixin)

export default ImageFlagged
