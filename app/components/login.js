/* @flow */


const PHONE_MASK_USA = '999 999-9999'

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

import TopTabs from '../controls/topSignupSigninTabs'
import PhoneNumberInput from '../controls/phoneNumberInput.js'
import PinScreen from './pin'

import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import SingleInputScreenMixin from '../mixins/SingleInputScreenMixin'
import TrackKeyboardMixin from '../mixins/keyboardMixin'

@reactMixin.decorate(TimerMixin)
@reactMixin.decorate(TrackKeyboardMixin)
@reactMixin.decorate(SingleInputScreenMixin)
class Login extends Component{
  constructor(props){
    super();
    this.state = {
      phone: '',
      isLoading: false,
    }
  }
  formattedPhone(){
    return this.state.inputFieldValue.replace(/[\. ,:-]+/g, '')
  }

  onError =(err)=>{
    console.log(err);
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
  }
  componentWillUnmount(){
    AuthErrorStore.unlisten(this.onError);
  }

  shouldHide(val) { return (val.length < PHONE_MASK_USA.length) ? true : false  }
  shouldShow(val) { return (val.length === PHONE_MASK_USA.length) ? true : false  }

  handleInputChange =(event: any)=> {
    var update = {
      inputFieldValue: event.nativeEvent.text
    };

    if(event.nativeEvent.text.length < this.state.inputFieldValue.length){
      update.phoneError = null
    }

    this.setState(update)
  }

  _submit =()=> {
    // if(!this.state.canContinue){
    //   return false;
    // }
    this.setTimeout( () => {
      if(this.state.phoneError){ return false; }

      this.props.navigator.push({
        component: PinScreen,
        title: '',
        id:'pw',
        sceneConfig: CustomSceneConfigs.HorizontalSlide,
        passProps: {
          phone: this.formattedPhone(),
          initialKeyboardSpace: this.state.keyboardSpace
        }
      })
    },500);
    UserActions.requestPinLogin(this.formattedPhone());

  }

  render(){

    return (
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: this.state.keyboardSpace}]}>
        <ScrollView
          keyboardDismissMode={'interactive'}
          contentContainerStyle={[styles.wrap, {left: 0}]}
          bounces={false}
          >
          <View style={[styles.phoneInputWrap,
              (this.state.inputFieldFocused ? styles.phoneInputWrapSelected : null),
              (this.state.phoneError ? styles.phoneInputWrapError : null)]}>

            <PhoneNumberInput
            mask={PHONE_MASK_USA}
            ref="phoneinputbox"
              style={styles.phoneInput}
              keyboardType={'phone-pad'}
              placeholder={'Phone'}
              placeholderTextColor="#fff"
              autoFocus={true}
              autoCorrect={false}
              onChange={this.handleInputChange.bind(this)}
              onFocus={this.handleInputFocused.bind(this)}
              onBlur={this.handleInputBlurred.bind(this)}
              keyboardAppearance={'dark'/*doesnt work*/}

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
}




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

