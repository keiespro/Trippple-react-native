/* @flow */


import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, NativeModules, View, TouchableHighlight, Dimensions, PixelRatio, ScrollView, TouchableOpacity} from "react-native";
import BackButton from '../components/BackButton'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import { BlurView, VibrancyView } from 'react-native-blur'

class BlurModal extends React.Component{

  constructor(props){
    super()
    this.state = { }
  }

  cancel(){
    this.props.navigator.pop()
  }

  render(){

    return  (
      <Image source={{uri:this.props.user.image_url}} resizeMode="cover">
        <VibrancyView blurType="light" style={localstyles.blurstyle} />

        {this.props.noscroll ?
          <View style={{
          width:DeviceWidth,
          height:DeviceHeight,
        }}>
        {this.props.children}
        </View> :
          <ScrollView style={localstyles.modalscroll} contentContainerStyle={localstyles.modalscrollcontainer}>
            {this.props.children}
          </ScrollView>
        }

        </Image>

    )
  }

}



export default BlurModal

const localstyles = StyleSheet.create({
  blurstyle:{
    position:'absolute',
    top:0,
    width:DeviceWidth,
    height:DeviceHeight,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column'
  },
  modalscroll:{
    padding:0,
    width:DeviceWidth,
    // height:DeviceHeight,

    flex:1,
    position:'absolute'
  },
  modalscrollcontainer:{
    // justifyContent:'center',
    flex:1
    // alignItems:'center',
    // height:DeviceHeight,width:DeviceWidth
  }
})
