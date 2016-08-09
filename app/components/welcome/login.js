/* @flow */


const PHONE_MASK_USA = '(999) 999-9999'

import React from "react";
import {Component} from "react";
import {StyleSheet, Text, View, ScrollView, Image, TouchableHighlight, LayoutAnimation, Dimensions, TextInput} from "react-native";

import CustomSceneConfigs from '../../utils/sceneConfigs'
import colors from '../../utils/colors'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import UserActions from '../../flux/actions/UserActions'
import AuthErrorStore from '../../flux/stores/AuthErrorStore'

import TopTabs from '../../controls/topSignupSigninTabs'
import PhoneNumberInput from '../../controls/phoneNumberInput'
import PinScreen from './pin'
import {MagicNumbers} from '../../DeviceConfig'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import SingleInputScreenMixin from '../../mixins/SingleInputScreenMixin'
import TrackKeyboardMixin from '../../mixins/keyboardMixin'
import Mixpanel from '../../utils/mixpanel'

import libphonenumber from 'google-libphonenumber';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();



class Login extends Component{
  constructor(props){
    super();
    this.state = {
      phone: '',
      isLoading: false,
      absoluteContinue: true,
      keyboardSpace: MagicNumbers.keyboardHeight || 240
    }
  }

  formattedPhone(){
    return this.state.inputFieldValue
  }

  onError(err){
    console.log(err);
    if(!err || !err.phoneError){
        return;
    }
    let errorMessage;

    if(typeof err.phoneError === 'string'){
      errorMessage = err.phoneError
    }else{
      errorMessage = 'We seem to be having some trouble right now. Please try again later.';
    }

    this.setState({
      phoneError: errorMessage,
      canContinue: false
    })
  }
  componentDidMount(){
    AuthErrorStore.listen(this.onError.bind(this));
  }
  componentWillUnmount(){
    AuthErrorStore.unlisten(this.onError.bind(this));
  }

  shouldHide(state) { return (state.phone.length != 10) }
  shouldShow(state) { return (state.phone.length == 10) }

  handleInputChange(newValues: any){
    var {phone} = newValues;

    if(phone && phone.length < this.state.phone.length){
      newValues.phoneError = null
    }
    this.setState(newValues)
  }

  _submit(){
    if(!this.state.canContinue){
      return false;
    }
    let phoneNumber = phoneUtil.parse(this.state.phone, 'US');

    if(phoneUtil.isValidNumber(phoneNumber)){
      UserActions.requestPinLogin(this.state.phone);

      this.setTimeout( () => {
        if(this.state.phoneError){ return false; }

        this.props.navigator.push({
          component: PinScreen,
          title: 'pin',
          id:'pw',
          // sceneConfig: CustomSceneConfigs.HorizontalSlide,
          passProps: {
            phone: this.state.phone,
            initialKeyboardSpace: this.state.keyboardSpace
          }
        })
      },500);
    }else{

      this.onError({phoneError:"Phone number is invalid."})

    }

  }

  render(){
    return (
      <View style={[{ height:DeviceHeight-80, backgroundColor: colors.outerSpace, width:DeviceWidth}]}>

            <PhoneNumberInput
              key={'loginphone'}
              keyboardHeight={this.state.keyboardSpace}
              style={styles.phoneInput}
              continueButton={this.renderContinueButton()}
              phoneError={this.state.phoneError}
              inputFieldFocused={this.state.inputFieldFocused}
              handleInputChange={this.handleInputChange.bind(this)}
            />

    </View>

    );
  }
}



reactMixin.onClass(Login, TimerMixin);
reactMixin.onClass(Login, SingleInputScreenMixin);

Login.displayName = "Login"

export default Login;



const styles = StyleSheet.create({

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
    padding:0

  },
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,

    alignSelf: 'stretch'
  },
  phoneInputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  underPinInput: {
    marginTop: 10,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
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
  },
  bottomErrorText:{
    marginTop: 0,
    color: colors.mandy,
    fontSize: 16,
    fontFamily:'Omnes-Regular',

  },
  phoneInputWrapError:{
    borderBottomColor: colors.mandy,
  },
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
