/* @flow */


var React = require('react-native');
var { TextInput,View,StyleSheet  } = React;
// var DocumentSelectionState = require('react-native/Libraries/vendor/document/selection/DocumentSelectionState');
var ReactMaskMixin = require('../mixins/maskedInputMixin.js');

import TimerMixin from 'react-timer-mixin';
var _ = require('underscore')

var PhoneNumberInput = React.createClass({
  mixins:[ReactMaskMixin,TimerMixin],

  getInitialState: function(){
    return ({
      inputFieldValue: ''
    })
  },
  componentDidUpdate(props,state){
    if(this.mask.props.value != props.mask.value){
      this._textInput3.focus()
      this.setTimeout(()=>{console.log('focus'); this._textInput.focus()},40)
    }

  },

  render: function(){
    console.log(this.props,this.mask.props.value,this.state)
    return (
      <View>
      <View style={{flexDirection:'row',position:'relative'}}>
      <TextInput
        maxLength={14}
        ref={component => this._textInput = component}
        {...this.props}
        {...this.mask.props}
        style={[this.props.style,{
                fontSize: 26,color:'#fff',flex:1,alignSelf:'stretch'
              }]}

              keyboardType={'numeric'}
              placeholderTextColor="#fff"
              autoCorrect={false}
              autoFocus={true}
              value={this.mask.props.value || ` `}
        onSubmitEditing={e => console.log(e)}
        />
        <TextInput
          editable={false}
          maxLength={14}
          keyboardType={this.props.keyboardType}
          style={[this.props.style,{
            fontSize: 26,color:'#fff',flex:1,alignSelf:'stretch',position:'absolute',top:0,left:0,right:0,bottom:0
          }]}
          placeholder={this.mask.props.fullValue || `(       )        -     `}
          placeholderTextColor={'#fff'}
          ref={component => this._textInput2 = component}
        />
        <TextInput
          editable={false}
          keyboardType={this.props.keyboardType}
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
