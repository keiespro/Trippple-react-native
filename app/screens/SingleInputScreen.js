import React from "react";
import {Component} from "react";
import {StyleSheet, Text, TextInput, View, Navigator, Image, LayoutAnimation, ScrollView, Dimensions, TouchableHighlight} from "react-native";

import UserActions from '../flux/actions/UserActions'
import colors from '../utils/colors'
import ContinueButton from '../controls/ContinueButton'


import {MagicNumbers} from '../DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class SingleInputScreen extends Component{


  constructor(props){
    super(props);
    this.state = {
      inputFieldFocused: false,
      inputFieldValue: '',
      inputFieldError: null,
      canContinue: false,
      keyboardSpace: 0,
      isKeyboardOpened: false
    }
  }

  componentDidMount(){
    // Emitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    // Emitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
  }

  componentWillUnmount() {
    // Emitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    // Emitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
  }
  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }

  componentDidUpdate(){

    if( !this.state.canContinue && this.props.shouldShow(this.state.inputFieldValue)){
      this.showContinueButton();
    }else if( this.state.canContinue && this.props.shouldHide(this.state.inputFieldValue)){
      this.hideContinueButton();
    }
  }
  updateKeyboardSpace(frames){
    if(!frames.endCoordinates){return false}
    this.setState({
      keyboardSpace: frames.endCoordinates.height,
      isKeyboardOpened: true
    });
  }

  resetKeyboardSpace(){
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }
  handleContinue(){
    if(!this.state.canContinue){
      return false;
    }

    this.setState({
      inputFieldError: null
    })
    this._submit && this._submit(this.state.inputFieldValue)
  }

  showContinueButton(){
    this.setState({
      canContinue: true
    })
  }

  hideContinueButton(){
    this.setState({
      canContinue: false
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      inputFieldValue: nextProps.inputFieldValue,
      inputFieldFocused: nextProps.inputFieldFocused
    })
  }

  _submit(){
    this.props.handleNext()
  }
 render(){
    return(
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: this.state.keyboardSpace, backgroundColor: colors.outerSpace}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap]}
          onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
          onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
          bounces={false}
          >
          <View style={styles.middleTextWrap}>
            <Text style={styles.middleText}>{this.props.toptext || 'What should we call you?'}</Text>
          </View>

          <View style={
              [styles.pinInputWrap,
              (this.props.inputFieldFocused ? styles.phoneInputWrapSelected : null)]}>
          {this.props.children}
          </View>


          <View style={styles.middleTextWrap}>
            <Text style={[styles.middleText,{fontSize:18}]}>{this.props.bottomtext || 'Fake names get 93.6% less matches.'}</Text>
          </View>


        </ScrollView>

        <ContinueButton
        canContinue={this.state.canContinue}
        handlePress={this._submit.bind(this)} />

      </View>

     )
  }
}

export default SingleInputScreen


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
    backgroundColor: colors.outerSpace

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
      height: 60,
      alignSelf: 'stretch'
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
      height: MagicNumbers.is4s ? 30 : 60,
      marginBottom:MagicNumbers.is4s ? 0 : 10
    },
    middleText: {
      color:colors.rollingStone,
      fontSize:20,
      fontFamily:'omnes',
      textAlign:'center',

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
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
      // alignItems: '',
      alignSelf: 'stretch'
    },
    goBackButton:{
      padding:10,
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
      fontSize: 18,
      fontFamily:'Omnes-Regular',
    },
    bottomErrorTextWrap:{

    },
    bottomErrorText:{
      marginTop: 0,
      color: colors.mandy,
      fontSize: 16,
      fontFamily:'Omnes-Regular',

    },
    phoneInputWrapSelected:{
      borderBottomColor: colors.mediumPurple,
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
      fontSize: 26,
      fontFamily:'Montserrat',
      color: colors.white,
      textAlign:'center'
    }
  });
