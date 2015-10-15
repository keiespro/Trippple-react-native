/* @flow */

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

import React from 'react-native'
import { Text,TextInput,View,StyleSheet  } from 'react-native'
import TimerMixin from 'react-timer-mixin';
import s from 'underscore.string'
import MaskableTextInput from '../RNMaskableTextInput.js'
import colors from '../utils/colors'

class PhoneNumberInput extends React.Component{

  constructor(props){
    super()
    this.state = {
      maskedPhone: '',
      palceholder: true
    }
  }

  componentDidUpdate(prevProps,prevState){
    const {maskedPhone} = this.state
    if(maskedPhone.length && maskedPhone.length > prevState.maskedPhone.length){
      this._textInput.setSelectionRange(maskedPhone.length,maskedPhone.length)
    }
  }

  processValue(value){
    var sanitizedText = (value+'')
        .replace(/[\. ,():+-]+/g, '')
        .replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');

    var maskedPhone,
        paddedValue = s(sanitizedText).pad(10, ` `, 'right').value()

    maskedPhone = maskMap.reduce( (phone, mapChar, index) => {
      return (mapChar.position <= phone.length ? s.insert(phone,mapChar.position,mapChar.char) : phone)
    },sanitizedText)

    this.setNativeProps({
      text:maskedPhone,
      fullText: maskedPhone + emptyMask.substr(maskedPhone.length,10)
    })
    var newState = {maskedPhone}
    console.log(sanitizedText)
    if(sanitizedText.length == 0){
      newState.placeholder = true
    }else if(sanitizedText.length > 0 && this.state.placeholder){
      newState.placeholder = false
    }
    this.setState(newState)
    this.props.handleInputChange({phone: sanitizedText,inputFieldValue:sanitizedText})
  }

  setNativeProps(np) {
    var {text,fullText} = np
    this._textInput.setNativeProps({ text });
    this._textInput2.setNativeProps({ text: fullText });

  }

  onChangeText(text){
    this.processValue(text)
  }

  render(){
    return (
      <View>
        <View style={{flexDirection:'row',position:'relative'}}>
          {this.state.placeholder ? null : <Text style={{left:'0',top:15,position:'absolute',color:colors.white,fontSize:26}}>+1</Text>}
          <MaskableTextInput
            ref={component => this._textInput = component}
            style={[this.props.style,{
              paddingLeft:40,
              fontSize: 26,color:'#fff',flex:1,alignSelf:'stretch'
            }]}
            maxLength={14}
            keyboardType={'numeric'}
            placeholderTextColor="#fff"
            autoCorrect={false}
            autoFocus={true}
            onFocus={()=>{/*this._textInput.setNativeProps({editable:false})*/}}
            onBlur={()=>{/*this._textInput.setNativeProps({editable:true})*/}}
            onChangeText={this.onChangeText.bind(this)}
            value={this.state.maskedPhone}
          />
          <TextInput
            editable={false}
            maxLength={14}
            keyboardType={'numeric'}
            style={[this.props.style,{
              paddingLeft:40,
              fontSize: 26,
              color:'#fff',flex:1,alignSelf:'stretch',position:'absolute',top:0,left:0,right:0,bottom:0
            }]}
            ref={component => this._textInput2 = component}
          />
        </View>
      </View>
    )
  }
}

export default PhoneNumberInput
