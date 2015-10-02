/* @flow */

var mask = '(999) 999+9999',
    MASK_REGEX = new RegExp('[9]'),
    MASK_CHARS = '9',
    cursor,
    cursorPrev,
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
        char: '+'
      },
    ],
    maskArr= ['(',')',' ','+'];

import React from 'react-native'
import { TextInput,View,StyleSheet  } from 'react-native'
import ReactMaskMixin from '../mixins/maskedInputMixin'
import TimerMixin from 'react-timer-mixin';
import s from 'underscore.string'
import MaskableTextInput from '../RNMaskableTextInput.js'
var PhoneNumberInput = React.createClass({

  getInitialState: function(){
    return ({
      inputFieldValue: '',
      maskedPhone: '',

    })
  },

  componentDidUpdate(props,state){
    // console.log(this.state.maskedPhone, state.maskedPhone)
    if(this.state.maskedPhone.length && this.state.maskedPhone.length > state.maskedPhone.length){
    //   this._textInput3.focus()
    this._textInput.setSelectionRange(this.state.maskedPhone.length,this.state.maskedPhone.length,)
    }


  },
  processValue(value){
    var sanitizedText = (value+'')
      .replace(/[\. ,():+-]+/g, '')
      .replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');

    console.log('sanitized Text',sanitizedText)

    var maskedPhone,

        paddedValue = s(sanitizedText).pad(10, ` `, 'right').value()

    console.log('paddedValue',paddedValue)


    maskedPhone = maskMap.reduce( (phone, mapChar, index) => {
      return (mapChar.position <= phone.length ? s.insert(phone,mapChar.position,mapChar.char) : phone)
    },sanitizedText)

    console.log('maskedPhone',maskedPhone)

      this.setNativeProps({
        text:maskedPhone
      })
      this.setState({maskedPhone})

  },


    setNativeProps(np) {
      console.log('snp')
      this._textInput.setNativeProps({
        text: np.text
      });

      // this._textInput2.setNativeProps({text:np.fullText});
    },
    onChange(e){
      console.log('---------',this._textInput.state.mostRecentEventCount,e.nativeEvent.eventCount)
      var t = e.nativeEvent.text;
      console.log(e,e.nativeEvent,this)
    },

  onChangeText(text){
    console.log('changed text',text)


    this.processValue(text)
  },
  shouldComponentUpdate(nProps,nState){
    // return (this.mask.props.value && this.state.inputFieldValue != nState.inputFieldValue)
      // var upd = (maskArr.indexOf(nState.maskedPhone[nState.maskedPhone.length-1]) >= 0) || ((nState.maskedPhone.length - this.state.maskedPhone.length) >= 1)
      // console.log(upd);
      // return upd
      return true
  },

  render(){

    return (
      <View>
      <View style={{flexDirection:'row',position:'relative'}}>
      <MaskableTextInput
        ref={component => this._textInput = component}
        style={[this.props.style,{
          fontSize: 26,color:'#fff',flex:1,alignSelf:'stretch'
        }]}
        maxLength={14}
        keyboardType={'numeric'}
        placeholderTextColor="#fff"
        autoCorrect={false}
        autoFocus={true}
        editable={false}
        onChange={this.onChange}
        onChangeText={this.onChangeText}
        defaultValue={`(`}
          value={this.state.maskedPhone}


        />

        <MaskableTextInput
          editable={false}
          keyboardType={'numeric'}
          onFocus={()=>{this._textInput.focus();}}
          style={[this.props.style,{height:0,overflow:'hidden' }]}
          ref={component => this._textInput3 = component}
        />


      </View>
    </View>
    )
  }
})

module.exports = PhoneNumberInput;

var styles = StyleSheet.create({
  inputPiece:{
   fontSize: 26,
   width: 100,
   backgroundColor:'blue'
   }
})
