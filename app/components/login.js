/* @flow */

'use strict';

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

var PhoneNumberInput = require('../controls/phoneNumberInput.js');

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
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 50,
    alignSelf: 'stretch'
  },
  phoneInputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  phoneInput: {
    height: 50,
    padding: 4,
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


var Login = React.createClass({
  mixins: [TrackKeyboard],

  getInitialState(){
    return({
      phone: '',
      pin: '',
      isLoading: false,
      phoneFocused: true
    })
  },
  formattedPhone(){
    return this.state.phone.replace(/[\. ,:-]+/g, "")
  },
  onError(err){
    if(!err.phoneError) return false;

    this.setState({
      phoneError: err.pinError
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
    if(!this.state.canContinue && this.state.phone.length == PHONE_MASK_USA.length){
      this.showContinueButton();
    }else if(this.state.canContinue && this.state.phone.length < PHONE_MASK_USA.length){
      this.hideContinueButton();
    }
  },

  handlePhoneChange(event: any){
    this.setState({
      phone: event.nativeEvent.text
    })
  },

  handlePhoneInputFocused(){
    this.setState({
      phoneFocused: true
    })
  },

  handlePhoneInputBlurred(){
    this.setState({
      phoneFocused: false
    })
  },

  handleContinue(){
    if(!this.state.canContinue){
      return false;
    }

    UserActions.requestPinLogin(this.formattedPhone());

    this.setState({
      phoneError: null
    })

    this.props.navigator.push({
      component: PinScreen,
      title: '',
      id:'pw',
      sceneConfig: CustomSceneConfigs.HorizontalSlide,
      passProps: {
        phone: this.formattedPhone(),
        error: this.state.verifyError,
        initialKeyboardSpace: this.state.keyboardSpace
      }
    })
  },

  showContinueButton(){
    this.setState({
      canContinue: true
    })
  },

  hideContinueButton(){
    this.setState({
      canContinue: false
    })
  },

  render(){
    var paddingBottom = this.state.keyboardSpace;
    var phoneValue = this.state.phone //.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return (
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: paddingBottom}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap, {left: 0}]}
          bounces={false}
          >
          <View style={[styles.phoneInputWrap,(this.state.phoneFocused ? styles.phoneInputWrapSelected : null)]}>

            <PhoneNumberInput
              mask={PHONE_MASK_USA}
              style={styles.phoneInput}
              value={phoneValue}
              keyboardType={'phone-pad'}
              placeholder={'Phone'}
              keyboardAppearance={'dark'/*doesnt work*/}
              placeholderTextColor='#fff'
              autoFocus={false}
              autoCorrect={false}
              onChange={this.handlePhoneChange}
              onFocus={this.handlePhoneInputFocused}
              onBlur={this.handlePhoneInputBlurred}
            />
          </View>

        {/*
        <View style={[styles.middleTextWrap,{opacity: ~~!this.state.isKeyboardOpened}]}>
          <Text style={[styles.middleText]}>OR</Text>
        </View>
        <View style={[styles.middleTextWrap, {opacity: ~~!this.state.isKeyboardOpened}]}>
          <Facebook/>
         </View>
       */}

        </ScrollView>

        <View style={[styles.continueButtonWrap,
            {bottom: this.state.canContinue ? 0 : -80,
              backgroundColor: this.state.canContinue ? colors.mediumPurple : 'black'
            }]}>
          <TouchableHighlight
             style={[styles.continueButton]}
             onPress={this.handleContinue}
             underlayColor="black">

             <Text style={styles.continueButtonText}>CONTINUE</Text>
           </TouchableHighlight>
        </View>


    </View>

    );
  }
})




module.exports = Login;
