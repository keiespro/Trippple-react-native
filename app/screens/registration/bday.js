/**
 * @flow
 */

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
  DatePickerIOS,
  TouchableHighlight,
} from 'react-native'

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import moment from 'moment'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import SingleInputScreen from '../SingleInputScreen'

class BdayScreen extends Component{
  static defaultProps  = {
    date: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  }


  constructor(props){
    super(props);
    this.state = {
      timeZoneOffsetInHours:props.timeZoneOffsetInHours,
      date: props.user.bdate ? new Date(props.user.bdate) : moment().subtract(18,'years').toDate()
    }
  }
  _submit =()=>{
    UserActions.updateUserStub({
      bday_month: this.state.date.getMonth(),
      bday_year: this.state.date.getYear()
    })
    this.props.navigator.push({
      component: this.props.nextRoute,
      passProps: {
        bday: this.state.date
      }
    })

  }

  onDateChange = (date) => {

    this.setState({
      inputFieldValue: date,
      date: date
    })
    console.log(date,this.state.date);
    UserActions.updateUserStub({bdate: date});

  }

  _setMonth(){}

  _setYear(){}

  render(){
    return (
      <View style={[
          styles.container,
          {
            flex: 1,
            height:DeviceHeight,
            paddingBottom: 230
          }
        ]}>

        <SingleInputScreen
          shouldHide={(val) => false }
          shouldShow={(val) => true }
          inputFieldValue={this.state.inputFieldValue}
          handleNext={this._submit.bind(this)}
          >

          <View style={[styles.pinInputWrap,(this.state.inputFieldFocused ? styles.phoneInputWrapSelected : null)]}>
            <Text style={styles.fakeInput}>
              {moment(this.state.date).format('MMMM D, YYYY') || this.state.inputFieldValue || 'DATE OF BIRTH'}
            </Text>
          </View>

        </SingleInputScreen>
        <View style={[{flex: 1, height: this.state.keyboardSpace},styles.bdayKeyboard]}>

          <DatePickerIOS
            minimumDate={moment().subtract(68,'years').toDate()}
            maximumDate={moment().subtract(18,'years').toDate()}
            date={this.state.date}
            mode="date"
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
          />

        </View>
      </View>
     )
  }
}

export default BdayScreen


const styles = StyleSheet.create({
    bdayKeyboard:{
      height: 230,
      backgroundColor: colors.white,
      flex:1,
      position:'absolute',
      bottom:0,
      alignSelf: 'center',
      width: DeviceWidth,
      alignItems:'center',
      justifyContent:'center'
    },
    container: {
      flex: 1,
      justifyContent:'space-between',
      alignItems:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      padding:0,
      height: DeviceHeight,
    backgroundColor: colors.outerSpace

    },
    wrap: {
      flex: 2,
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'stretch',
      width: DeviceWidth,
      margin:0,
      backgroundColor: 'transparent',
      padding:20,
      height: DeviceHeight

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
    fakeInput: {
      height: 60,
      padding: 8,
      fontSize: 30,
      fontFamily:'Montserrat',
      color: colors.white,
      textAlign:'center'
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

  });

