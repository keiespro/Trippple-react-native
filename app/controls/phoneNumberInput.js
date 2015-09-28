/* @flow */


var React = require('react-native');
var { TextInput,View,StyleSheet  } = React;
// var DocumentSelectionState = require('react-native/Libraries/vendor/document/selection/DocumentSelectionState');
var ReactMaskMixin = require('../mixins/maskedInputMixin.js');
var _ = require('underscore')
var PhoneNumberInput = React.createClass({

  getInitialState: function(){
    return ({
      phone1: '',
      phone2: '',
      phone3: ''
    })
  },
  onTextChangeOne: function(text){
    this.setState({phone1: text})
      console.log(text)

    if(text.length == 3){
      this._textInput2.focus()
      console.log('focus next?')
      this.setState({currentBox: 2})

    }
  },
  onTextChangeTwo: function(text){
    this.setState({phone2: text})
    if(text.length == 3){
      this._textInput3.focus()
      this.setState({currentBox: 3})

    }
  },
  onTextChangeThree: function(text){
    this.setState({phone3: text})
    if(text.length == 4){
      var phone = this.state.phone1 + this.state.phone2 + this.state.phone3;
      if(phone.length == 10){
        console.log('PHONE',phone)
      }
    }
  },
  onTextChangeThree: function(text){
    this.setState({phone3: text})
  },
  componentDidUpdate: function(prevProps,prevState){
    if(this.state.currentBox == 3){
      if(prevState.phone3.length == 1 && this.state.phone3.length == 0){
        this.setState({currentBox: 2})
        this._textInput2.focus()

      }
    }
    if(this.state.currentBox == 2){
      if(prevState.phone2.length == 1 && this.state.phone2.length == 0){
        console.log('GO BACK !')
        this.setState({currentBox: 1})
        this._textInput1.focus()

      }
    }
  },
  render: function(){
    console.log(this.props)
    return (
      <View>
      <View style={{flexDirection:'row',position:'relative'}}>
      <TextInput
        maxLength={3}
        onChangeText={this.onTextChangeOne}
        ref={component => this._textInput1 = component}
        {...this.props}
        value={this.state.phone1}
              autoFocus={true}
        style={[this.props.style,styles.inputPiece]}
        onSubmitEditing={e => console.log(e)}
        />
      <TextInput
        maxLength={3}
        onChangeText={this.onTextChangeTwo}
        ref={component => this._textInput2 = component}
        {...this.props}
        value={this.state.phone2}

        style={[this.props.style,styles.inputPiece]}

        onSubmitEditing={e => console.log(e)}
        />
      <TextInput
        maxLength={4}
        onChangeText={this.onTextChangeThree}
        ref={component => this._textInput3 = component}
        {...this.props}
        value={this.state.phone3}

        style={[this.props.style,styles.inputPiece]}

        onSubmitEditing={e => console.log(e)}
        />

      <TextInput
        ref={component => this._placeHolder = component}
        placeholder={('(___)    -     ')}
        editable={false}
        placeholderColor={'white'}
        style={[this.props.style,{ fontSize: 26,position:'absolute',top:0,left:0,background:'red',width:400  }]}
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
