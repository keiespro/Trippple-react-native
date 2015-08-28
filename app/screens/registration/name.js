import React from 'react-native'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  LayoutAnimation,
  ScrollView,
  Dimensions,
  Component,
  TouchableHighlight,
} from 'react-native'

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import SingleInputScreen from '../SingleInputScreen'

class NameScreen extends Component{


  constructor(props){
    super(props);
    console.log(props.user)
    this.state = {
      name: props.user.firstname || ''
    }
  }


  handleInputChange =(event)=> {
    this.setState({
      inputFieldValue: event.nativeEvent.text
    })
  }

  _submit =()=>{
    UserActions.updateUserStub({firstname: this.state.inputFieldValue});
    console.log(this.props)
    this.props.navigator.push({
            component: this.props.nextRoute,
            passProps: {
              firstname: this.state.inputFieldValue,
              keyboardSpace: this.state.keyboardSpace
            }
          })

  }
 render(){
    return(
      <SingleInputScreen
        shouldHide={(val) => { return (val.length <= 0) ? true : false }}
        shouldShow={(val) => { return (val.length > 0)  ? true : false }}
        inputFieldValue={this.state.inputFieldValue}
        handleNext={this._submit.bind(this)}
        >


            <TextInput
              style={styles.pinInput}
              defaultValue={this.state.name || this.state.inputFieldValue || ''}
              keyboardAppearance={'dark'/*doesnt work*/}
              autoCapitalize={'words'}
              placeholder={'FIRST NAME'}
              placeholderTextColor={colors.offwhite}
              autoCorrect={false}
              clearButtonMode={'never'}
              textAlign={'center'}
              onChange={this.handleInputChange}
            />
             </SingleInputScreen>
        )
  }
}

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
      color: colors.rollingStone,
      fontSize: 21,
      fontFamily:'Montserrat',
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

