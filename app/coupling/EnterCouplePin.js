/* @flow */


import React, {Component, PropTypes} from "react";
import { StyleSheet, Image, ScrollView, TextInput, Text, LayoutAnimation, ActivityIndicator, View, TouchableHighlight, NativeModules, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import {MagicNumbers} from '../DeviceConfig'
import Numpad from '../components/Numpad'
import BlurModal from '../modals/BlurModal'
import BackButton from '../components/BackButton'
import ContinueButton from '../controls/ContinueButton'

import UserActions from '../flux/actions/UserActions'
import { BlurView, VibrancyView } from 'react-native-blur'

class EnterCouplePin extends React.Component{
  constructor(props){
    super()
    this.state = {
      pin: '',
      submitting: false,
      absoluteContinue: true,
      verifyError: null,
      inputFieldValue:''
    }
  }

  backspace(){
    this.handleInputChange({pin: this.state.inputFieldValue.substring(0,this.state.inputFieldValue.length-1)  })
  }

  onChangeText(digit){
    if(this.state.inputFieldValue.length >= 14){ return false}
    this.handleInputChange({pin: this.state.inputFieldValue + digit  })
  }

  handleInputChange(event: any){
    if(!event && typeof event != 'object'){ return false}
    const pin =   event.nativeEvent ?  event.nativeEvent.text : event.pin;

    this.setNativeProps({text:pin})
    this.setState({
      inputFieldValue: pin
    })

  }
  handleSubmit(){
    if(!this.state.verifyError && !this.state.submitting && this.state.inputFieldValue.length >= 6) {
      UserActions.verifyCouplePin(this.state.inputFieldValue);
      this.setState({
        submitting: true
      })
    }
  }

  componentDidUpdate(pProps,pState){
    if(pProps.couple && !pProps.couple.verified && this.props.couple && this.props.couple.verified){
      this.setState({
        success: true
      })
    }else if(pProps.couple && !pProps.couple.verifyError  && this.props.couple && this.props.couple.verifyError){
      this.setState({
        error: this.props.couple.verifyError
      })
    }
  }
  componentWillReceiveProps(nProps){
    if(nProps.pin){

      this.handleInputChange({pin:nProps.pin})
    }
  }
  popToTop(){
    const currentRoutes = this.props.navigator.getCurrentRoutes();
    if(currentRoutes[1].id == 'Settings'){
      this.props.navigator.popToRoute(currentRoutes[1]);
    }else{
      this.props.navigator.popToRoute(currentRoutes[0]);
    }    
  }

  setNativeProps(np) {
    var {text} = np
    this._inp && this._inp.setNativeProps({text });
  }

  componentWillUpdate(props, state) {
     if(state.inputFieldValue.length > 0 && this.state.inputFieldValue.length == 0 || state.inputFieldValue.length == 0 && this.state.inputFieldValue.length > 0) {
       LayoutAnimation.configureNext(animations.layout.spring);
     }
  }

  render(){
    const couple = this.props.couple;

    return (
      <BlurModal noscroll={true} user={this.props.user}>
          <View style={{width:DeviceWidth,height:DeviceHeight-MagicNumbers.keyboardHeight,position:'relative'}}>
            <ScrollView style={{width:DeviceWidth,top:0}} contentContainerStyle={[{height:DeviceHeight-MagicNumbers.keyboardHeight,width:DeviceWidth,flex:1,top:0,left:0}]} >
       
          <View style={[{top:0,marginBottom:MagicNumbers.is5orless ? 0 : 50, flexDirection:'column',alignItems:'center',justifyContent:'center',  height:DeviceHeight-MagicNumbers.keyboardHeight,marginHorizontal:MagicNumbers.screenPadding/2,flex:1 }]}>
              <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:MagicNumbers.is5orless ? 17 : 20,color:'#fff',marginVertical:10 }]}>
                CONNECT WITH YOUR PARTNER
              </Text>
              <Text style={[styles.rowtext,styles.bigtext,{
                fontSize: MagicNumbers.is5orless ? 16 : 18,
                marginVertical:10,
                color:'#fff',
                marginBottom:15,textAlign:'center',
                flexDirection:'column'
              }]}>What is your partner’s “couple code”?</Text>
          <View style={[ styles.pinInputWrap,{marginHorizontal:MagicNumbers.screenPadding/2,borderBottomColor:colors.mediumPurple}, (this.state.verifyError  ? styles.pinInputWrapError : null), ]} >
            <TextInput
              maxLength={10}
              style={[styles.pinInput,{
                fontSize: 26,
              }]}
              ref={(inp) => this._inp = inp}
              editable={false}
              keyboardAppearance={'dark'}
              keyboardType={'phone-pad'}
              autoCapitalize={'none'}
              placeholder={'ENTER PIN'}
              placeholderTextColor={'#fff'}
              autoCorrect={false}
              textAlign={'center'}
            />
          </View>

          <View style={[styles.middleTextWrap,styles.underPinInput]}>
            {this.state.verifyError &&
              <View style={styles.bottomErrorTextWrap}>
                <Text textAlign={'right'} style={[styles.bottomErrorText]}>Nope. Try again</Text>
              </View>
            }
          </View>
        </View>
          <ContinueButton canContinue={this.state.inputFieldValue.length > 0} absoluteContinue={true} handlePress={this.handleSubmit.bind(this)}/>
   
          <View style={{width:100,height:20,left:10,top:-10,flex:1,position:'absolute',alignSelf:'flex-start'}}>
            <BackButton navigator={this.props.navigator}/>
          </View>
        
        </ScrollView>
        
        </View>

       
        
        <View style={{position:'relative',height:MagicNumbers.keyboardHeight}}>
          <Numpad numpadstyles={{backgroundColor:'transparent'}} backspace={this.backspace.bind(this)} onChangeText={this.onChangeText.bind(this)}/>
        </View>        
      </BlurModal>
    )
  }
}


export default EnterCouplePin


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
