var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  LayoutAnimation,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  SegmentedControlIOS
} = React;

var UserActions = require('../../flux/actions/UserActions');
var Birthday = require('../../controls/birthday');
var ImageUpload = require('../../components/imageUpload');
var Privacy = require('../../components/privacy');
var colors = require('../../utils/colors')
var TrackKeyboard = require('../../mixins/keyboardMixin');
var SingleInputScreenMixin = require('../../mixins/SingleInputScreenMixin');

var BdayScreen = require('./bday')
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var DistanceSlider = require('../../controls/distanceSlider');
var ToggleSwitch = require('../../controls/switches');





var NameScreen = React.createClass({

  mixins: [TrackKeyboard, SingleInputScreenMixin],

  getInitialState(){
    return({
      name: this.props.user.firstname || ''
    })
  },

  shouldHide(val) { return (val.length <= 2) ? true : false  },
  shouldShow(val) { return (val.length > 2)  ? true : false  },

  handleInputChange(event){
    this.setState({
      inputFieldValue: event.nativeEvent.text
    })
  },

  _submit(){
    this.props.navigator.push({
            component: BdayScreen,
            id: 'aboutyoubday',
            passProps: {
              firstname: this.state.inputFieldValue,
              keyboardSpace: this.state.keyboardSpace
            }
          })

  },

  render(){
    return(
      <View style={[{flex: 1, height:DeviceHeight, paddingBottom: this.state.keyboardSpace}]}>
        <ScrollView
          keyboardDismissMode={'on-drag'}
          contentContainerStyle={[styles.wrap]}
          bounces={false}
          >
          <View style={styles.middleTextWrap}>
            <Text style={styles.middleText}>What should we call you?</Text>
          </View>

          <View style={
              [styles.pinInputWrap,
              (this.state.inputFieldFocused ? styles.phoneInputWrapSelected : null)]}>

            <TextInput
              style={styles.pinInput}
              value={this.state.name || this.state.inputFieldValue || ''}
              keyboardAppearance={'dark'/*doesnt work*/}
              autoCapitalize={'words'}
              placeholder={'FIRST NAME'}
              placeholderTextColor='#fff'
              autoFocus={true}
              autoCorrect={false}
              clearButtonMode={'never'}
              textAlign={'center'}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFieldFocused}
              onBlur={this.handleInputFieldBlurred}
            />
          </View>

          <View style={styles.middleTextWrap}>
            <Text style={[styles.middleText,{fontSize:14}]}>Fake names get 93.6% less matches. </Text>
          </View>

        </ScrollView>

        {this.renderContinueButton()}


      </View>

     )
  }
})



var styles = StyleSheet.create({

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

module.exports = NameScreen;
