/* @flow */

 ;

var PHONE_MASK_USA = "999 999-9999";

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  LayoutAnimation,
  TextInput
} = React;

var TrackKeyboard = require('../mixins/keyboardMixin');
var CustomSceneConfigs = require('../utils/sceneConfigs');

var colors = require('../utils/colors')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var UserActions = require('../flux/actions/UserActions');

var AuthErrorStore = require('../flux/stores/AuthErrorStore');

var Facebook = require('./facebook');
var TopTabs = require('../controls/topSignupSigninTabs');

var PhoneNumberInput = require('../controls/inputFieldNumberInput.js');

var PinScreen = require('./pin')
var styles = StyleSheet.create({

  container: {
    flex: 1,
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
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:20

  },
  inputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 60,
    alignSelf: 'stretch'
  },
  inputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  input: {
    height: 60,
    padding: 8,
    fontSize: 30,
    fontFamily:'Montserrat',
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
    fontFamily:'Montserrat',
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    flex: 1,
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
  continueButtonWrap:{
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 80,
    backgroundColor: colors.mediumPurple,
    width:DeviceWidth
  },
  continueButton: {
    height: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueButtonText: {
    padding: 4,
    fontSize: 30,
    fontFamily:'Montserrat',
    color: colors.white,
    textAlign:'center'
  }
});

var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};


var SingleInputPage = React.createClass({
  mixins: [TrackKeyboard],

  getInitialState(){
    return({
      inputField: '',
      pin: '',
      isLoading: false,
      inputFieldFocused: true
    })
  },
  formattedValue(){
    return this.props.format(this.state.inputFieldValue)
  },
  onError(err){
    if(!err.inputFieldError) return false;

    this.setState({
      inputFieldError: err.pinError
    })
  },
  componentDidMount(){
    AuthErrorStore.listen(this.onError);
  },
  componentWillUnmount(){
    AuthErrorStore.unlisten(this.onError);
  },
  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }


    if(state.scene !== this.state.scene) {
      // LayoutAnimation.configureNext(animations.layout.spring);
    }
  },

  componentDidUpdate(){
    if(!this.state.canContinue && this.state.inputFieldValue.length == PHONE_MASK_USA.length){
      this.showContinueButton();
    }else if(this.state.canContinue && this.state.inputFieldValue.length < PHONE_MASK_USA.length){
      this.hideContinueButton();
    }
  },

  render(){
    var paddingBottom = this.state.keyboardSpace;
    var inputFieldValue = this.state.inputFieldValue //.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return (
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: paddingBottom}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap, {left: 0}]}
          bounces={false}
          >
          <View style={[styles.inputWrap,(this.state.inputFieldValueFocused ? styles.inputWrapSelected : null)]}>

            <PhoneNumberInput
              style={styles.input}
              value={inputFieldValue}
              keyboardType={this.props.keyboardType}
              placeholder={this.props.placeholder}
              keyboardAppearance={'dark'/*doesnt work*/}
              placeholderTextColor={this.props.placeholderTextColor}
              autoFocus={this.props.autoFocus}
              autoCorrect={this.props.autoCorrect}
              onChange={this.handleChange}
              onFocus={this.handleInputFocused}
              onBlur={this.handleInputBlurred}
            />
          </View>

        </ScrollView>

        <View style={[styles.continueButtonWrap,
            {bottom: this.state.canContinue ? 0 : -80,
              backgroundColor: this.state.canContinue ? colors.mediumPurple : 'black'
            }]}>
          <TouchableHighlight
             style={[styles.continueButton]}
             onPress={this.handleContinue}
             underlayColor="black">
             <View>
               <Text style={styles.continueButtonText}>CONTINUE</Text>
             </View>
           </TouchableHighlight>
        </View>


    </View>

    );
  }
})




module.exports = SingleInputPage;
