var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  DatePickerIOS
} = React;

var UserActions = require('../../flux/actions/UserActions');
var Birthday = require('../../controls/birthday');
var ImageUpload = require('../../components/imageUpload');
var Privacy = require('../../components/privacy');
var colors = require('../../utils/colors')
var TrackKeyboard = require('../../mixins/keyboardMixin');
var SingleInputScreenMixin = require('../../mixins/SingleInputScreenMixin');

var moment = require('moment');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var DistanceSlider = require('../../controls/distanceSlider');
var ToggleSwitch = require('../../controls/switches');
var GenderScreen = require('./gender');




var BdayScreen = React.createClass({

  mixins: [TrackKeyboard, SingleInputScreenMixin],
  getDefaultProps() {
      return {
        date: new Date(),
        timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      };
    },

  getInitialState(){
    console.log(this.props.user)
    return({
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      date: this.props.user.bdate ? new Date(this.props.user.bdate) : moment().subtract(18,'years').toDate()
    })
  },

  shouldHide(val) { return false },
  shouldShow(val) { return true },


  _submit(){
    this.props.navigator.push({
            component: GenderScreen,
            id: 'yourgender',
            passProps: {
              bday: this.state.date
            }
          })

  },
  onDateChange(date){

    UserActions.updateUserStub({bdate: date});
    //
    // this.setState({
    //   inputFieldValue: date,
    //   date: date
    // })
    console.log(date,this.state.date);

  },
  _setMonth(){},
  _setYear(){},
  
  render(){
    window.moment = moment;
    return(
      <View style={[styles.container,{flex: 1, height:DeviceHeight, paddingBottom: 230}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap]}
          bounces={false}
          >
          <View style={[styles.pinInputWrap,(this.state.inputFieldFocused ? styles.phoneInputWrapSelected : null)]}>

            <Text
              style={styles.fakeInput}>{moment(this.state.date).format('MMMM D, YYYY') || this.state.inputFieldValue || 'DATE OF BIRTH'}
            </Text>
          </View>

        </ScrollView>
        {this.renderContinueButton()}

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
})



var styles = StyleSheet.create({
    bdayKeyboard:{
      height: 230,
      backgroundColor: colors.white,
      flex:1,
      position:'absolute',
      bottom:0
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
      backgroundColor: 'transparent',
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

module.exports = BdayScreen;