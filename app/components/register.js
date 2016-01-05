/* @flow */


const PHONE_MASK_USA = '(999) 999-9999'

import React from 'react-native'

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  LayoutAnimation,
  Dimensions,
  TextInput,
  Component
} from 'react-native'

import CustomSceneConfigs from '../utils/sceneConfigs'
import colors from '../utils/colors'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import UserActions from '../flux/actions/UserActions'
import AuthErrorStore from '../flux/stores/AuthErrorStore'
import {MagicNumbers} from '../DeviceConfig.js'

import TopTabs from '../controls/topSignupSigninTabs'
import PhoneNumberInput from '../controls/phoneNumberInput.js'
import PinScreen from './pin'

import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import SingleInputScreenMixin from '../mixins/SingleInputScreenMixin'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import Mixpanel from '../utils/mixpanel';

class Register extends Component{
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

  onError =(err)=>{
    if(!err || !err.phoneError){
        return;
    }

    this.setState({
      phoneError: err.phoneError,
      canContinue: false
    })
  }
  componentDidMount(){
    AuthErrorStore.listen(this.onError);
    Mixpanel.track('On - Register Screen');
  }
  componentWillUnmount(){
    AuthErrorStore.unlisten(this.onError);
  }

  shouldHide(state) { return (state.phone.length != 10) }
  shouldShow(state) { return (state.phone.length == 10) }

  handleInputChange =(newValues: any)=> {
    var {phone} = newValues;
    if(phone && phone.length < this.state.phone.length){
      newValues.phoneError = null
    }
    this.setState(newValues)
  }

  _submit =()=> {
    // if(!this.state.canContinue){
    //   return false;
    // }
    const phoneNumber = this.state.phone;

    UserActions.requestPinLogin(phoneNumber);

    this.setTimeout( () => {
      if(this.state.phoneError){ return false; }

      this.props.navigator.push({
        component: PinScreen,
        title: '',
        id:'pw',
        sceneConfig: CustomSceneConfigs.HorizontalSlide,
        passProps: {
          phone: phoneNumber,
          initialKeyboardSpace: this.state.keyboardSpace
        }
      })
    },500);

  }

  render(){

    return (
      <View style={[{flex: 1, height:DeviceHeight,width:DeviceWidth}]}>

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


reactMixin.onClass(Register, TimerMixin);
reactMixin.onClass(Register, TrackKeyboardMixin);
reactMixin.onClass(Register, SingleInputScreenMixin);


export default Register;



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
    fontSize: 26,
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
