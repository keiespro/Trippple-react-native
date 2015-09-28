
import React from 'react-native'
var {
  Component,
  StyleSheet,
  View,
  InteractionManager,
  PixelRatio,
  Dimensions
} = React;

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from '../utils/colors'

var Dots = React.createClass({
  componentWillMount(){
    console.log(this.props)

  },

  render(){
    const dotWidth = 10;
    return (
        <View style={{flexDirection:'row',flex:1,justifyContent:'space-around',alignItems:'center',width:dotWidth*4,height:34}}>
          <View style={{width:dotWidth,height:dotWidth,borderRadius:dotWidth/2,backgroundColor:colors.shuttleGray}}/>
          <View style={{width:dotWidth,height:dotWidth,borderRadius:dotWidth/2,backgroundColor:colors.shuttleGray}}/>
          <View style={{width:dotWidth,height:dotWidth,borderRadius:dotWidth/2,backgroundColor:colors.shuttleGray}}/>
        </View>
    )
  }
})

export default Dots
