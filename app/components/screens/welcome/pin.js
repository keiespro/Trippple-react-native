'use strict';

const Pin_MASK_USA = '999 999-9999';

import React from "react";
import {StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, LayoutAnimation, TextInput, Dimensions, Alert, NativeModules, ScrollView} from "react-native";

import CustomSceneConfigs from '../../../utils/sceneConfigs'
const {RNMail} = NativeModules;
import colors from '../../../utils/colors'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import ActionMan from '../../../actions/'
import SingleInputScreenMixin from '../../mixins/SingleInputScreenMixin'
import BackButton from '../../buttons/BackButton'
import Analytics from '../../../utils/Analytics'
import { connect } from 'react-redux';

const Pin = React.createClass({
  mixins: [SingleInputScreenMixin],

  getInitialState(){
    return ({
      pin: '',
      submitting: false,
      absoluteContinue: true,

      verifyError: null
    })
  },


  onError(err){
    if(!err.verifyError){
      return false;
    }

    this.setState({
      submitting: false,
      verifyError: err.verifyError
    })
  },

  shouldHide(val) { return false},
  shouldShow(val) { return false},


  handleInputChange(event: any){
    if(!event && typeof event != 'object'){ return false}
    const pin = event.nativeEvent ?  event.nativeEvent.text : event.pin;

    // Submit pin automatically when 4 digits have been entered
    if(!this.props.authError && !this.state.submitting && pin.length >= 4) {
      this.setState({
        submitting: true
      })
      this.props.dispatch(ActionMan.verifyPin(pin,this.props.phone))



    }else{

      // this.setNativeProps({text:pin})
      this.setState({
        inputFieldValue: pin
      })
    }
  },

  setNativeProps(np) {
    var {text} = np
    this._inp && this._inp.setNativeProps({text });
  },


  componentDidUpdate(prevProps, prevState){

    // Reset error state
    if(prevState.submitting && prevState.inputFieldValue.length > this.state.inputFieldValue.length ) {
      this.setState({
        submitting: false,
      })
    }
//     // Handle "Account Disabled" response
//     if(this.props.authError && this.props.authError.message === 'Account disabled' && !prevState.verifyError){
//
// //reactivate logged in users
//
//
//       const env = NativeModules.RNAppInfo;
//       const telemetry = {}
//       Object.keys(env).forEach((k)=>{if(k!=''){telemetry[k] = env[k]}})
//       Alert.alert(
//         'Account disabled',
//         'Your account has been deactivated. If you did not request this, please contact us.',
//         [
//           {text: 'Contact us', onPress: () => RNMail.mail({
//                 subject: 'Help! My account is disabled.',
//                 recipients: ['hello@trippple.co'],
//                 body: 'Help! '+JSON.stringify(telemetry)
//               }, (error, event) => {
//                   if(error) {
//                     Alert.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
//                   }
//               })
//             },
//           {text: 'OK', onPress: () => this.props.navigator.popToTop()},
//         ]
//       )
//     }

  },

  onChangeText(input){
    // const digits = [...input]
    // const ints = digits.map(digit => !Number.isInteger(parseInt(digit)))
    // if(ints.indexOf(true) > -1 ) return false;
    //
    // if( this.state.inputFieldValue.length >= 4 ){ return false}
    // this.handleInputChange({pin: input.slice(0,4)  })
  },

  goBack(){
    this.props.navigator.pop();
  },
  render(){
    return (
      <View
        style={[{flex: 1,
          justifyContent:'space-between',alignItems:'center',backgroundColor: colors.outerSpace, paddingBottom: this.state.keyboardSpace || 280}]}
        >
         <View style={{width:100,height:50,left:10,top:-10,alignSelf:'flex-start'}}>
          <BackButton navigator={this.props.navigator}/>
        </View>


          <View style={[styles.middleTextWrap,{marginTop:20}]}>
            <Text style={[styles.middleText]}>We've sent you a login pin</Text>
          </View>

          <View style={[{marginBottom:50, marginHorizontal:20,paddingBottom:50, alignSelf: 'stretch',}]}>
          <View
            style={[
              styles.pinInputWrap,
              (this.state.inputFieldFocused ? styles.pinInputWrapSelected : null),
              (this.props.authError && this.state.inputFieldValue.length == 4 ? styles.pinInputWrapError : null),
              ]}
            >
            <TextInput
              maxLength={10}
              style={[styles.pinInput,{
                fontSize: 26,
                color: this.props.authError ? colors.mandy : colors.white
              }]}
              ref={(inp) => this._inp = inp}
              editable={true}
              keyboardAppearance={'dark'}
              keyboardType={'number-pad'}
              autoCapitalize={'none'}
              placeholder={'ENTER PIN'}
              placeholderTextColor={'#fff'}
              autoCorrect={false}
              textAlign={'center'}
              clearButtonMode={'while-editing'}
              autoFocus={true}
              selectionColor={colors.mediumPurple}
              onChangeText={this.onChangeText}
              onChange={this.handleInputChange}
            />
          </View>

          <View style={[styles.middleTextWrap,styles.underPinInput]}>

            {this.props.authError && this.state.inputFieldValue.length == 4 &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text textAlign={'right'} style={[styles.bottomErrorText]}>Nope. Try again</Text>
                </View>
            }
          </View>

        </View>
          {/* <Numpad backspace={this.backspace} onChangeText={this.onChangeText}/> */}
       </View>
    )

  }


})



Pin.displayName = "PinScreen"


const mapStateToProps = (state, ownProps) => {
  
  return { ...ownProps, authError: state.auth.error }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin);


module.exports = Pin


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
    backgroundColor: colors.outerSpace,
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
  pinInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 62,
     alignSelf: 'stretch',
    marginBottom:0
  },
  pinInputWrapSelected:{
    borderBottomColor: colors.mediumPurple,
  },
  pinInputWrapError:{
    borderBottomColor: colors.mandy,
  },
  pinInput: {
    height: 60,
    padding: 8,
    fontSize: 30,
    fontFamily:'Montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    marginBottom:0,
    height: 60,
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 20,
    fontFamily:'omnes',
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
  underPinInput: {
    marginTop: 10,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  goBackButton:{
    padding:20,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
  bottomTextIcon:{
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop:0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Omnes-Regular',
  },
  bottomErrorTextWrap:{

  },
  bottomErrorText:{
    marginTop: 0,
    color: colors.mandy,
    fontSize: 16,
    fontFamily:'Omnes-Regular',

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
