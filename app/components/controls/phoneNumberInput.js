'use strict';

const mask = '(999) 999-9999',
    emptyMask = `(\u2007\u2007\u2007)\u2007\u2007\u2007\u2007-\u2007\u2007\u2007\u2007`,
    maskMap = [
      {
        position: 0,
        char: '('
      },
      {
        position: 4,
        char: ')'
      },
      {
        position: 5,
        char: ' '
      },
      {
        position: 9,
        char: '-'
      },
    ],
    maskArr= ['(',')',' ','-'];


import React from "react";
import { Text,TextInput,View,StyleSheet,TouchableHighlight,Dimensions,PixelRatio  } from 'react-native'
import TimerMixin from 'react-timer-mixin';
import s from 'underscore.string'
import colors from '../../utils/colors'
import {MagicNumbers} from '../../utils/DeviceConfig'
import Numpad from './Numpad'
const KEYBOARD_HEIGHT = MagicNumbers.keyboardHeight

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class PhoneNumberInput extends React.Component{

  constructor(props){
    super()
    this.state = {
      maskedPhone: '',
      sanitizedText: '',
      placeholder: true,
     }
  }




  processValue(value){
    var sanitizedText = (value+'')
        .replace(/[\. ,():+-]+/g, '')
        // .replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');

    var maskedPhone,
        paddedValue = s(sanitizedText).pad(10, `\u2007`, 'right').value();

    maskedPhone = maskMap.reduce( (phone, mapChar, index) => {
      return (mapChar.position <= phone.length ? s.insert(phone,mapChar.position,mapChar.char) : phone)
    },sanitizedText)
    this.handleValueChange(maskedPhone,sanitizedText)
  }
  handleValueChange(masked,sanitized){
    if(masked.length == 1){
      masked = ''
    }
    this.setNativeProps({
      text:masked,
      fullText: masked.length == 0 ? '' : masked + emptyMask.substr(masked.length,14),
     })

    const newState = {maskedPhone:masked, sanitizedText: sanitized}

    if(masked.length == 0 ){
      newState.placeholder = true
    }else{
      newState.placeholder = false
    }

    this.setState(newState)

    this.props.handleInputChange({phone: sanitized,inputFieldValue:sanitized})

  }

  setNativeProps(np) {
    var {text,fullText} = np
    this._textInput && this._textInput.setNativeProps({text: fullText.length > 1 ? '+1\u2007'+fullText : null });
    // this._textInput2.setNativesProps({ text: fullText });

  }

  onChangeText(text){
    if(this.state.maskedPhone.length >= 14){
      return false
    }
    this.processValue(this.state.maskedPhone + text)
  }
  backspace(){
    const newText = this.state.sanitizedText.substring(0,this.state.sanitizedText.length-1)
    this.processValue(newText)
  }
  render(){

    return (
      <View style={{height: DeviceHeight,position:'relative'}}>
        <View style={{
          alignSelf:'flex-start',
          flexDirection:'column',
          position:'relative',
          alignItems:'center',
          justifyContent:'center',
          height:DeviceHeight-80-KEYBOARD_HEIGHT,
        }}
        >
          <View style={[styles.phoneInputWrap,
            (this.props.inputFieldFocused ? styles.phoneInputWrapSelected : null),
            (this.props.phoneError ? styles.phoneInputWrapError : null),{ }]}>

            <TextInput
              editable={false}
              ref={component => this._textInput = component}
              style={[{
                textAlign:'center',
                fontSize: 26,color:'#fff',height:60,width:MagicNumbers.screenWidth,
                fontFamily:'montserrat'
              }]}
              maxLength={14}
              keyboardType={'numeric'}
              placeholderTextColor="#fff"
              autoFocus={false}
              autoCorrect={false}
              placeholder={'PHONE NUMBER'}
            />
            {this.props.phoneError &&
              <View style={{position:'absolute',bottom:-45}}>
                <Text
                  textAlign={'right'}
                  style={[styles.bottomErrorText]}>
                  {this.props.phoneError}
                </Text>
              </View>
            }
          {/*{this.props.phoneError && <View ><Text textAlign={'right'} style={[styles.bottomErrorText]}>Did you mean to register?</Text> </View>}*/}
          </View>



          {this.props.continueButton}
            {this.props.renderButtons && (
              <View style={{position:'absolute',bottom:-80}}>
              {this.props.renderButtons()}
          </View>)}

        </View>


        <Numpad
          backspace={this.backspace.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
        />

      </View>
    )
  }
}

export default PhoneNumberInput





const styles = StyleSheet.create({

  container: {
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  wrap: {
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:0

  },
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    marginHorizontal:MagicNumbers.screenPadding/2,
    // flex1,
    alignItems:'center',
    height:80,
    alignSelf:'center',
    justifyContent:'center',
    flexDirection:'column',
  },
  phoneInputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  phoneInput: {
    height: 60,
    padding: 8,
    fontSize: 26,
    fontFamily:'montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    fontFamily:'montserrat',
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },

  bottomErrorText:{
    marginTop: 0,
    color: colors.mandy,
    fontSize: 16,
    fontFamily:'omnes',

  },
  phoneInputWrapError:{
    borderBottomColor: colors.mandy,
  },
});
//
// var animations = {
//   layout: {
//     spring: {
//       duration: 500,
//       create: {
//         duration: 300,
//         type: LayoutAnimation.Types.easeInEaseOut,
//         property: LayoutAnimation.Properties.opacity
//       },
//       update: {
//         type: LayoutAnimation.Types.spring,
//         springDamping: 200
//       }
//     },
//     easeInEaseOut: {
//       duration: 300,
//       create: {
//         type: LayoutAnimation.Types.easeInEaseOut,
//         property: LayoutAnimation.Properties.scaleXY
//       },
//       update: {
//         delay: 100,
//         type: LayoutAnimation.Types.easeInEaseOut
//       }
//     }
//   }
// };
