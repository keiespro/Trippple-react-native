/* @flow */

'use strict';

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

var colors = require('../utils/colors')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var UserActions = require('../flux/actions/UserActions');

var Facebook = require('./facebook');
var TopTabs = require('../controls/topSignupSigninTabs');

var PhoneNumberInput = require('../controls/phoneNumberInput.js');

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
    // marginBottom:60,
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
      password: '',
      isLoading: false,
      phoneFocused: false
    })
  },
  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }
  },
  handlePhoneChange(event: any){
    this.setState({
      phone: event.nativeEvent.text
    })
  },

  handlePasswordChange(event: any){
    this.setState({
      password: event.nativeEvent.text
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

  handleLogin(){
    UserActions.login(this.state.phone,this.state.password)
  },

  render(){
    var paddingBottom = this.state.keyboardSpace;
    var phoneValue = this.state.phone //.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return (
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: paddingBottom}]}>

      <ScrollView
        keyboardDismissMode={'on-drag'}
        contentContainerStyle={styles.wrap}
        bounces={false}
        >

        <View
          style={[styles.phoneInputWrap,(this.state.phoneFocused ? styles.phoneInputWrapSelected : null)]}>

          <PhoneNumberInput
            mask="+1 999 999-9999"
            style={styles.phoneInput}
            value={phoneValue}
            keyboardType={'phone-pad'}
            placeholder={'Phone'}
            keyboardAppearance={'dark'}
            placeholderTextColor='#fff'
            onChange={this.handlePhoneChange}
            onFocus={this.handlePhoneInputFocused}
            onBlur={this.handlePhoneInputBlurred}
            />
        </View>

        <View style={[styles.middleTextWrap,{opacity: ~~!this.state.isKeyboardOpened}]}>
          <Text style={[styles.middleText]}>OR</Text>
        </View>
        <View style={[styles.middleTextWrap, {opacity: ~~!this.state.isKeyboardOpened}]}>
          <Facebook/>
         </View>

      </ScrollView>
    </View>

    );
  }
})




module.exports = Login;
