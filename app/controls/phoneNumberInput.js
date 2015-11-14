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
// import MaskableTextInput from '../RNMaskableTextInput.js'
import colors from '../utils/colors'

class PhoneNumberInput extends React.Component{

  constructor(props){
    super()
    this.state = {
      maskedPhone: '',
      placeholder: true
    }
  }

  componentDidUpdate(prevProps,prevState){
    const {maskedPhone} = this.state
    if(maskedPhone.length && maskedPhone.length > prevState.maskedPhone.length){
      // this._textInput.setSelectionRange(maskedPhone.length,maskedPhone.length)
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
    if(maskedPhone.length == 1){
      maskedPhone = ''
    }
    if(this.state.placeholder == false){

    }
    this.setNativeProps({
      text:maskedPhone,
      fullText: maskedPhone.length == 0 ? '' : maskedPhone + emptyMask.substr(maskedPhone.length,10),
      style:{
        left: maskedPhone.length == 0 ? 0 : 40
      }
    })
    var newState = {maskedPhone}
    console.log(sanitizedText.length)
    if(maskedPhone.length == 0 ){
      newState.placeholder = true
    }else{
      newState.placeholder = false
    }
    console.log(newState)
    this.setState(newState)

    this.props.handleInputChange({phone: sanitizedText,inputFieldValue:sanitizedText})

  }

  setNativeProps(np) {
    var {text,fullText} = np
    this._textInput.setNativeProps({ text });
    this._textInput2.setNativeProps({ text });

  }

  onChangeText(text){
    this.processValue(text)
  }

  render(){
    return (
      <View>
        <View style={{flexDirection:'row',position:'relative'}}>
          <TextInput
            editable={false}
            maxLength={14}
            placeholderTextColor={colors.white}
            placeholder={`PHONE NUMBER`}
            keyboardType={'numeric'}
            style={[this.props.style,{
              left:(this.state.placeholder ? 0 : 40),
              fontSize: 26,

              color:'#fff',flex:1,alignSelf:'stretch',position:'absolute',top:0,right:0,bottom:0
            }]}
            value={this.state.placeholder ? '' : this.state.maskedPhone}
            ref={component => this._textInput2 = component}
          />
          <TextInput
            ref={component => this._textInput = component}
            style={[this.props.style,{
              left: (this.state.placeholder ? 0 : 40),

              fontSize: 26,color:'#fff',flex:1,alignSelf:'stretch',top:0,right:0,bottom:0
            }]}
            maxLength={14}
            keyboardType={'numeric'}
            placeholderTextColor="#fff"
            autoCorrect={false}
            autoFocus={true}
            onFocus={()=>{/*this._textInput.setNativeProps({editable:false})*/}}
            onBlur={()=>{/*this._textInput.setNativeProps({editable:true})*/}}
            onChangeText={this.processValue.bind(this)}
            value={this.state.placeholder ? '' : this.state.maskedPhone}
          />
        {this.state.placeholder ? null : <Text style={{left:0,top:15,position:'absolute',color:'transparent',fontSize:26}}>+1</Text>}

        </View>
      </View>
    )
  }
}

export default PhoneNumberInput
