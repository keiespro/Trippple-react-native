
import React,{ Component, } from "react";
import {
  NativeModules,
  StyleSheet,
  View,
  InteractionManager,
  PixelRatio,
  Dimensions
} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../../utils/colors'

var Dots = React.createClass({
  componentWillMount(){
  },

  render(){
    const dotWidth = 6,
        dots = [1,2,3],
        dotColor = this.props.dotColor || colors.shuttleGray;
    return (
        <View style={{
          width:dotWidth*8,

          height:43,
          justifyContent:'center',
          alignItems:'center',
        }}>
          <View style={{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            right:5,

          }}>

            { dots.map((dot,i) =>
                <View style={{ marginHorizontal:2, width:dotWidth, height:dotWidth, borderRadius:dotWidth/2, backgroundColor:dotColor}} key={'threedotsnumber'+i}/>
              )
            }
        </View>
      </View>
    )
  }
})

export default Dots
