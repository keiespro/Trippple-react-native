import React from "react";
import {Component} from "react";
import {StyleSheet, Text, TextInput, View, Navigator, Image, LayoutAnimation, ScrollView, Dimensions, TouchableHighlight} from "react-native";

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import BackButton from './BackButton'
import {MagicNumbers} from '../../DeviceConfig'
import OnboardingActions from '../../flux/actions/OnboardingActions'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import SingleInputScreen from '../SingleInputScreen'

class NameScreen extends Component{
  static defaultProps = {
    user: {}
  };

  constructor(props){
    super(props);
    this.state = {
      name: '',
      inputFieldValue:  '',
    }
  }

  componentDidMount(){

    this.setState({inputFieldValue: this.props.fb_name || this.props.user.firstname || '' })

  }


  handleInputChange(txt){

    this._textInput && this._textInput.setNativeProps({
      value: txt
    })
    this.setState({
      inputFieldValue: txt
    })
  }
  handleInputFieldFocused(){
     this.setState({
      inputFieldFocused: true
    })
  }
  handleInputFieldBlurred(){

      this.setState({
        inputFieldFocused: false
      })

  }
  _submit(){
    OnboardingActions.proceedToNextScreen({firstname: this.state.inputFieldValue})

  }
 render(){
   return(
    <View style={{width:DeviceWidth,height:DeviceHeight,position:'relative',backgroundColor:colors.outerSpace}}>
      <View style={{width:100,height:50,left:(MagicNumbers.screenPadding/2)}}>
        <BackButton/>
      </View>
      <SingleInputScreen
        shouldHide={(val) => { return (val.length <= 0) ? true : false }}
        shouldShow={(val) => { return (val.length > 0)  ? true : false }}
        inputFieldValue={this.state.inputFieldValue}
        inputFieldFocused={this.state.inputFieldFocused}
        handleNext={this._submit.bind(this)}
        >

        <TextInput
          style={[styles.pinInput,{
            fontSize: 22
          }]}
            defaultValue={this.props.fb_name || this.props.user.firstname || ''}
            keyboardAppearance={'dark'/*doesnt work*/}
            autoCapitalize={'words'}
            placeholder={'FIRST NAME'}
            placeholderTextColor={colors.white}
            autoCorrect={false}
            returnKeyType={'next'}
            autoFocus={false }
            maxLength={10}
            ref={component => this._textInput = component}
            clearButtonMode={'never'}
            onFocus={this.handleInputFieldFocused.bind(this)}
            onBlur={this.handleInputFieldBlurred.bind(this)}
            textAlign={'center'}
            onChangeText={this.handleInputChange.bind(this)}
          />
        </SingleInputScreen>
      </View>
    )
  }
}
NameScreen.displayName = "Name"
export default NameScreen


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
      height: 60
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
      fontSize: 30,
      fontFamily:'Montserrat',
      color: colors.white,
      textAlign:'center'
    }
  });
