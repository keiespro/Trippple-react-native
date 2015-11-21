/* @flow */

const KEYBOARD_HEIGHT = 280

import React from 'react-native'
import { Text,TextInput,View,StyleSheet,TouchableHighlight,Dimensions,PixelRatio  } from 'react-native'
import {BlurView,VibrancyView} from 'react-native-blur'
import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const digits =  [1, 2, 3, 4, 5, 6, 7, 8, 9]
// 2 cool
// const digits =  ( (i) =>  {return Array.from(new Array(9), () => i++)}(1))

class Numpad extends React.Component{

  constructor(props: Object){
    super()
  }

  render(){

    return (
        <BlurView
          style={styles.numberPadWrap}
          blurType={'dark'}
          >
          <View style={styles.keyWrapper}>
            { digits.map( (el,i)=>
              <TouchableHighlight
                key={'phonepad'+i}
                underlayColor={colors.dark}
                onPress={()=>this.props.onChangeText(i+1)}
                >
                <View style={[
                    styles.gridKeys,
                    { borderTopWidth: i >= 3 ? 1/PixelRatio.get() : 0 }
                  ]}>
                  <Text style={styles.whiteText}>
                    {i+1}
                  </Text>
                </View>
              </TouchableHighlight>
            ) }

            <TouchableHighlight
              key={'phonepadnull'}
              underlayColor={colors.dark}
              >
              <View style={styles.bottomRowKeys}>
                <Text style={styles.whiteText}>
                  {' '}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              key={'phonepad0'}
              underlayColor={colors.dark}
              onPress={()=>this.props.onChangeText('0')}
              >
              <View style={styles.bottomRowKeys}>
                <Text style={styles.whiteText}>
                  {'0'}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              key={'phonepaddel'}
              underlayColor={colors.dark}
              style={{alignSelf:'flex-end'}}
              onPress={()=>this.props.backspace()}
              >
              <View style={styles.bottomRowKeys}>
                <Text style={styles.backButton}>⌫</Text>
              </View>
            </TouchableHighlight>

          </View>
        </BlurView>
    )
  }
}
export default Numpad

const styles = StyleSheet.create({
  numberPadWrap: {
    height: KEYBOARD_HEIGHT,
    paddingVertical:20,
    flex:1,
    width:DeviceWidth,
    alignSelf:'flex-end',
    position:'absolute',
    bottom:0,
    left:0,
    backgroundColor:colors.mediumPurple20
  },
  keyWrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center',
    alignItems:'center'
  },
  gridKeys: {
    width:DeviceWidth/3.5,
    height:60,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'stretch',
    borderTopColor:colors.shuttleGray

  },

  bottomRowKeys: {
    width:DeviceWidth/3.5,
    height:60,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'stretch',
    borderTopWidth:1/PixelRatio.get(),
    borderTopColor:colors.shuttleGray
  },
  whiteText:{
    fontSize:30,
    textAlign:'center',
    color:colors.white
  },
  backButton:{
    fontSize:16,
    textAlign:'center',
    color:colors.white
  }

})
