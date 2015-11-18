/* @flow */

const KEYBOARD_HEIGHT = 280

import React from 'react-native'
import { Text,TextInput,View,StyleSheet,TouchableHighlight,Dimensions,PixelRatio  } from 'react-native'
import {BlurView,VibrancyView} from 'react-native-blur'
import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class Numpad extends React.Component{

  constructor(props){
    super()
    this.state = {
      digits:  (i) =>{ return Array.from(new Array(9), () => i++)}(1)
    }
  }

  render(){

    return (
    <BlurView style={{height: KEYBOARD_HEIGHT,paddingVertical:20,flex:1, width:DeviceWidth,alignSelf:'flex-end',position:'absolute',bottom:0,left:0}} blurType={'dark'}>
  <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
  { this.state.digits.map( (el,i)=>
    <TouchableHighlight key={'phonepad'+i} underlayColor={colors.dark} onPress={()=>this.props.onChangeText(i+1)}>
      <View style={[{width:DeviceWidth/3.5,height:60,flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch'},
        i >= 3 && {borderTopWidth:1/PixelRatio.get(),borderTopColor:colors.shuttleGray}]}>
        <Text style={{fontSize:30,textAlign:'center',color:colors.white}}>{i+1}</Text>
      </View>
    </TouchableHighlight>
  ) }

  <TouchableHighlight key={'phonepadnull'} underlayColor={colors.dark}>
    <View style={{width:DeviceWidth/3.5,height:60,flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch',borderTopWidth:1/PixelRatio.get(),borderTopColor:colors.shuttleGray}}>
      <Text style={{fontSize:30,textAlign:'center',color:colors.white}}>{' '}</Text>
    </View>
  </TouchableHighlight>
  <TouchableHighlight key={'phonepad0'} underlayColor={colors.dark} onPress={()=>this.props.onChangeText('0')}>
    <View style={{width:DeviceWidth/3.5,height:60,flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch',borderTopWidth:1/PixelRatio.get(),borderTopColor:colors.shuttleGray}}>
      <Text style={{fontSize:30,textAlign:'center',color:colors.white}}>{'0'}</Text>
    </View>
  </TouchableHighlight>
    <TouchableHighlight key={'phonepaddel'} underlayColor={colors.dark} style={{alignSelf:'flex-end'}} onPress={()=>this.props.backspace()}>
      <View style={{width:DeviceWidth/3.5,height:60,flex:1,justifyContent:'center',alignItems:'center',alignSelf:'stretch',borderTopWidth:1/PixelRatio.get(),borderTopColor:colors.shuttleGray}}>
        <Text style={{fontSize:16,textAlign:'center',color:colors.white}}>⌫</Text>
      </View>
    </TouchableHighlight>

  </View>
</BlurView>
)
}
}
export default Numpad
