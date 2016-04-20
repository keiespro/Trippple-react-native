
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
  },

  render(){
    var dotWidth = 7,
        dots = [1,2,3],
        dotColor =  colors.outerSpace;
    return (
        <View style={{
            flexDirection:'row',
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            width:dotWidth*4,
            height:34}}>

            { dots.map((dot,i) =>
                <View style={{ marginHorizontal:3, width:dotWidth, height:dotWidth, borderRadius:dotWidth/2, backgroundColor:dotColor}} key={'threedotsnumber'+i}/>
              )
            }
        </View>
    )
  }
})

export default Dots
