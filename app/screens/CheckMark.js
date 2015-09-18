


import React from 'react-native';

import { Component, View, Dimensions, Image } from 'react-native';

import colors from '../utils/colors'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class CheckMarkScreen extends Component{


  render(){

    if(!this.props.isVisible){ return false}

    return (
      <View style={{
        top:0,
        left:0,
        position:'absolute',
        width:DeviceWidth,height:DeviceHeight,
        backgroundColor:colors.outerSpace,
        alignItems:'center',
        justifyContent:'center'
      }}>
          <Image source={require('image!checkMark')} style={{width:250,height:250}}/>
        </View>
      )

  }

}

export default CheckMarkScreen
