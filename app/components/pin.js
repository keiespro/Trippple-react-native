/* @flow */



const Pin_MASK_USA = '999 999-9999';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  AlertIOS,
  ScrollView
} = React;

var CustomSceneConfigs = require('../utils/sceneConfigs');
var Mailer = require('NativeModules').RNMail;

var colors = require('../utils/colors')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var UserActions = require('../flux/actions/UserActions');

var AuthErrorStore = require('../flux/stores/AuthErrorStore');
import SingleInputScreenMixin from '../mixins/SingleInputScreenMixin'

import BackButton from './BackButton'


var PinScreen = React.createClass({
  mixins: [SingleInputScreenMixin],

  getInitialState(){
    return ({
      pin: '',
      submitting: false,
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
  componentDidMount(){ AuthErrorStore.listen(this.onError) },
  componentWillUnmount(){ AuthErrorStore.unlisten(this.onError) },



  shouldHide(val) { return false},
  shouldShow(val) { return false},


  handleInputChange(event: any){

    var pin = event.nativeEvent.text;

    if(pin.length > 4){
      event.preventDefault();
      return false;
    }


    // Submit pin automatically when 4 digits have been entered
    if(!this.state.verifyError && !this.state.submitting && pin.length === 4) {
      UserActions.verifySecurityPin(pin,this.props.phone);

      this.setState({
        submitting: true
      })


    }


    this.setState({
      inputFieldValue: pin
    })

  },

  componentDidUpdate(prevProps, prevState){

    // Reset error state
    if(prevState.inputFieldValue.length === 4 && this.state.inputFieldValue.length === 3) {
      this.setState({
        submitting: false,
        verifyError: false
      })
    }
    // Handle "Account Disabled" response
    if(this.state.verifyError && this.state.verifyError.message === 'Account disabled' && !prevState.verifyError){

      AlertIOS.alert(
        'Account disabled',
        'Your account has been deactivated. If you did not request this, please contact us.',
        [
          {text: 'Contact us', onPress: () => Mailer.mail({
                subject: 'Help! My account is disabled.',
                recipients: ['feedback@trippple.co'],
                body: 'Help!'
              }, (error, event) => {
                  if(error) {
                    AlertIOS.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
                  }
              })
            },
          {text: 'OK', onPress: () => this.props.navigator.popToTop()},
        ]
      )
    }

  },

  goBack(){
    this.props.navigator.pop();
  },
  render(){
    return (
      <View
        style={[{flex: 1,backgroundColor: colors.outerSpace,height:DeviceHeight, paddingBottom: this.state.keyboardSpace || 250}]}
        >
         <View style={{width:100,height:50,left:20,alignSelf:'flex-start'}}>
          <BackButton navigator={this.props.navigator}/>
        </View>

        <ScrollView
          contentContainerStyle={styles.wrap}
          keyboardDismissMode={'on-drag'}
          bounces={false}
          keyboardShouldPersistTaps={true}
          >

          <View style={[styles.middleTextWrap]}>
            <Text style={[styles.middleText]}>We've sent you a login pin</Text>
          </View>

          <View
            style={[
              styles.pinInputWrap,
              (this.state.inputFieldFocused ? styles.pinInputWrapSelected : null),
              (this.state.verifyError && this.state.inputFieldValue.length == 4 ? styles.pinInputWrapError : null),
              ]}
            >
            <TextInput
              maxLength={4}
              style={[styles.pinInput,{
                fontSize: 26
              }]}
              value={this.state.inputFieldValue || ''}
              keyboardAppearance={'dark'/*doesnt work*/}
              keyboardType={'phone-pad'}
              autoCapitalize={'none'}
              placeholder={'ENTER PIN'}
              placeholderTextColor={'#fff'}
              autoFocus={true}
              autoCorrect={false}
              clearButtonMode={'always'}
              textAlign={'center'}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFieldFocused}
              onBlur={this.handleInputFieldBlurred}
            />
          </View>

          <View style={[styles.middleTextWrap,styles.underPinInput]}>

            {this.state.verifyError && this.state.inputFieldValue.length == 4 &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text textAlign={'right'} style={[styles.bottomErrorText]}>Nope. Try again</Text>
                </View>
            }
          </View>

        </ScrollView>
      </View>
    )

  }


})





export default PinScreen;


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
    marginBottom:10,
    height: 60
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
    backgroundColor: 'transparent',
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
