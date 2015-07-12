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

var SingleInputScreenMixin = require('../mixins/SingleInputScreenMixin');

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
    height: 60,
    alignSelf: 'stretch'
  },
  phoneInputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  phoneInput: {
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


var Login = React.createClass({
  mixins: [TrackKeyboard, SingleInputScreenMixin],

  getInitialState(){
    return({
      phone: '',
      isLoading: false,
      phoneFocused: true
    })
  },

  formattedPhone(){
    return this.state.inputFieldValue.replace(/[\. ,:-]+/g, "")
  },

  onError(err){
    console.log(err)
    if(!err.phoneError){

        this.props.navigator.push({
          component: PinScreen,
          title: '',
          id:'pw',
          sceneConfig: CustomSceneConfigs.HorizontalSlide,
          passProps: {
            phone: this.formattedPhone(),
            error: this.state.phoneError,
            initialKeyboardSpace: this.state.keyboardSpace
          }
        })
        return;
    };

    this.setState({
      phoneError: err.phoneError,
      canContinue: false
    })
  },
  componentDidMount(){
    AuthErrorStore.listen(this.onError);
  },
  componentWillUnmount(){
    AuthErrorStore.unlisten(this.onError);
  },

  shouldHide(val) { return (val.length < PHONE_MASK_USA.length) ? true : false  },
  shouldShow(val) { return (val.length == PHONE_MASK_USA.length) ? true : false  },


    componentDidUpate(prevProps,prevState){

      // Reset error state

    },


  handleInputChange(event: any){
    var update = {
      inputFieldValue: event.nativeEvent.text
    };
    if(event.nativeEvent.text.length < this.state.inputFieldValue.length){

      update['phoneError'] = null

    }

    this.setState(update)
  },

  _submit(){
    if(!this.state.canContinue){
      return false;
    }

    UserActions.requestPinLogin(this.formattedPhone());

  },

  render(){

    return (
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: this.state.keyboardSpace}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap, {left: 0}]}
          bounces={false}
          >
          <View style={[styles.phoneInputWrap,
              (this.state.phoneFocused ? styles.phoneInputWrapSelected : null),
              (this.state.phoneError ? styles.phoneInputWrapError : null)]}>

            <PhoneNumberInput
              mask={PHONE_MASK_USA}
              style={styles.phoneInput}
              value={this.state.inputFieldValue}
              keyboardType={'phone-pad'}
              placeholder={'Phone'}
              keyboardAppearance={'dark'/*doesnt work*/}
              placeholderTextColor='#fff'
              autoFocus={false}
              autoCorrect={false}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFieldFocused}
              onBlur={this.handleInputFieldBlurred}
            />
          </View>
          {this.state.phoneError &&
              <View >
                <Text textAlign={'right'} style={[styles.bottomErrorText]}>Did you mean to register?</Text>
              </View>
          }
        </ScrollView>

        {this.renderContinueButton()}

    </View>

    );
  }
})




module.exports = Login;
