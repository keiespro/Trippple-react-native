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
  AlertIOS,
  LayoutAnimation,
  ScrollView,
  Dimensions,
  Component,
  DatePickerIOS,
  TouchableHighlight,
} from 'react-native'
import {MagicNumbers} from '../../DeviceConfig'


import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import moment from 'moment'
import BackButton from '../../components/BackButton'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import SingleInputScreen from '../SingleInputScreen'

class BdayScreen extends Component{
  static defaultProps  = {
    date: null,
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  }


  constructor(props){
    super();
    console.log(props)
    this.state = {
      error: false,
      timeZoneOffsetInHours:props.timeZoneOffsetInHours,
      date: props.fb_bday_year ? new Date(`${props.fb_bday_year}`) : new Date()
    }
  }
  _submit =()=>{
  var isLegal = moment(this.state.date).diff(moment(), 'years') < -18;
    if(!isLegal){return false}
    UserActions.updateUserStub({
      birthday: this.state.date,
      bday_month: this.state.date.getMonth()+1,
      bday_year: this.state.date.getFullYear()
    })
    // this.props.navigator.push({
    //   component: this.props.stack[this.props.currentIndex+1].component,
    //   passProps: {
    //     ...this.props,
    //     bday: this.state.date
    //   }
    // })
    //
    //
  var lastindex = this.props.navigator.getCurrentRoutes().length;
  console.log(lastindex);
  var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
              firstname:this.props.firstname,
              bday: this.state.date,
              stack: this.props.stack,

            }

    this.props.navigator.push(nextRoute)

  }

  onDateChange(date){

  var isLegal = moment(date).diff(moment(), 'years') < -18;
    if(!isLegal){
     this.setState({
        error:true,
        inputFieldValue: date,
        date: date,
        isLegal: false

    })

    }else{
      this._root.setNativeProps({date:date})

      this.setState({
        error:false,
        inputFieldValue: date,
        date: date,
        isLegal:true
      })

      console.log(date,this.state.date);
      UserActions.updateUserStub({
        birthday: moment(date).format('YYYY-MM-DD'),
        bday_month: date.getMonth()+1,
        bday_year: date.getFullYear()
      });
    }
  }

  _setMonth(){}

  _setYear(){}

  render(){

    var bdate;

    var {bday_month,bday_year,birthday} = this.props.user
    if(birthday){
      bdate = birthday
    }else if(this.props.fb_bday_year){
      bdate = new Date(`${this.props.fb_bday_year}`)
    }else if(bday_month && bday_year){
      bdate = new Date()
      bdate.setYear(bday_year)
      bdate.setMonth(bday_month -1)
      bdate = new Date(bdate)
    }


       return (
      <View style={[
          styles.container,
          {
            flex: 1,
            height:DeviceHeight,
            paddingBottom: 226
          }
        ]}>
 <View style={{width:100,height:50,left:MagicNumbers.screenPadding/2,alignSelf:'flex-start'}}>
        <BackButton navigator={this.props.navigator}/>
      </View>

        <SingleInputScreen
          shouldHide={(val) =>( !this.state.isLegal || !this.state.date || (this.state.date && this.state.error) ? 1 : 0)  }
          shouldShow={(val) => this.state.isLegal && this.state.date && !this.state.error  ? 1 : 0 }
          inputFieldValue={this.state.inputFieldValue}
          handleNext={this._submit.bind(this)}
          toptext={`What's your date of birth`}
          bottomtext={` `}

          >

          <View style={[styles.pinInputWrap,(this.state.inputFieldFocused ? styles.phoneInputWrapSelected : null),
              (this.state.error  ? styles.pinInputWrapError : null),
          ]}>
            <Text style={styles.fakeInput}>
              {this.state.date ? moment(this.state.date).clone().format('MMMM D, YYYY') : 'DATE OF BIRTH'}
            </Text>
          </View>

          <View style={[styles.middleTextWrap,styles.underPinInput]}>

            {this.state.error &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text textAlign={'right'} style={[styles.bottomErrorText]}>Must be 18 or older</Text>
                </View>
            }
          </View>

        </SingleInputScreen>
        <View ref={component => this._root = component} style={[{flex: 1, height: this.state.keyboardSpace},styles.bdayKeyboard]}>

        <DatePickerIOS
            ref={'picker'}
            mode="date"
            date={ this.state.date }
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange.bind(this)}
          />

        </View>
      </View>
     )
  }
}

export default BdayScreen


const styles = StyleSheet.create({
    bdayKeyboard:{
      height: 226,
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
      alignItems: 'center',
      alignSelf: 'stretch',
      width: DeviceWidth,
      margin: 0,
      padding: 0,
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
      fontSize: 28,
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
