/* @flow */


import React from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SwitchIOS,
  PixelRatio,
  AlertIOS,
  Animated,
  PickerIOS,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';

var Mailer = require('NativeModules').RNMail;

import dismissKeyboard from 'dismissKeyboard'
import WebViewScreen from './WebViewScreen'
import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import DistanceSlider from '../controls/distanceSlider'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import Privacy from './privacy'
import FacebookButton from '../buttons/FacebookButton'

import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import EditPage from './EditPage'
import CloseButton from './CloseButton'
import Api from '../utils/api'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'
import FieldModal from './FieldModal'




class SettingsSettings extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      privacy: this.props.user.privacy || 'public'
    }
  }
  togglePrivacy(value){
    var payload = {}
    payload[`privacy`] = value;
    UserActions.updateUser(payload)

    this.setState(payload)

  }
  componentDidMount() {
    Mixpanel.track('On - Setings Screen');
  }
  openWebview(page){
    var url, pageTitle;
    switch (page){
      case 'help':
        url = 'http://trippple.co/help.html';
        pageTitle = 'HELP';
        break;
      case 'privacy':
        url = 'http://trippple.co/privacy.html';
        pageTitle = 'PRIVACY POLICY';
        break;
      case 'terms':
        url = 'http://trippple.co/privacy.html';
        pageTitle = 'TERMS AND CONDITIONS';
        break;
    }

    this.props.navigator.push({
      component: WebViewScreen,
      title: '',
      id:'webview',
      sceneConfig: NavigatorSceneConfigs.FloatFromRight,
      passProps: {
        url,
        pageTitle
      }
    })
  }

  handleFeedback() {
    Mailer.mail({
      subject: 'I\'m have an issue in the app',
      recipients: ['feedback@trippple.co'],
      body: 'Help!'
    }, (error, event) => {
        if(error) {
          AlertIOS.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
        }
    });
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};

    var {privacy} = this.state

    console.log('settingOptions',settingOptions);
    return (
      <View style={styles.inner}>
          <FakeNavBar
            backgroundStyle={{backgroundColor:colors.shuttleGray}}
            hideNext={true}
            navigator={this.props.navigator}
            customPrev={
              <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
                <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
              </View>
            }
            onPrev={(nav,route)=> nav.pop()}
            title={`SETTINGS`}
            titleColor={colors.white}
            />
          <ScrollView style={{flex:1,marginTop:50}} contentContainerStyle={{   paddingHorizontal: 0}} centerContent={true} >
            <View style={{paddingHorizontal: 25,}}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Privacy</Text>
              </View>
            </View>
        <TouchableHighlight underlayColor={colors.dark} style={{paddingHorizontal: 25,}} onPress={()=>{this.togglePrivacy('public')}}>
          <View  style={[{
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor:colors.rollingStone,flex:1,height:130,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
          <View style={{flexWrap:'wrap',alignSelf:'stretch',flex:1,alignItems:'flex-start',justifyContent:'center',width:DeviceWidth-120,flexDirection:'column',paddingRight:20}}>
            <Text style={{color: privacy == 'public' ? colors.white : colors.rollingStone, fontSize:20,fontFamily:'Montserrat-Bold'}}>PUBLIC</Text>
          <Text style={{color: privacy == 'public' ? colors.white : colors.rollingStone,fontSize:18,fontFamily:'omnes',marginTop:5}}>
              Your profile is visible to all Trippple members.
                  </Text>
                </View>
                <View style={{width:30,marginHorizontal:10}}>
                  <Image style={{width:40,height:40}} source={privacy == 'public' ? require('image!ovalSelected') : require('image!ovalDashed')}/>
                </View>
                </View>
              </TouchableHighlight>

    <TouchableHighlight underlayColor={colors.dark} style={{paddingHorizontal: 25,}} onPress={()=>{this.togglePrivacy('private')}}>
      <View  style={[{
          borderBottomWidth: 1 / PixelRatio.get(),
          borderColor:colors.rollingStone,flex:1,height:130,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
      <View style={{flexWrap:'wrap',alignSelf:'stretch',flex:1,alignItems:'flex-start',justifyContent:'center',width:DeviceWidth-120,flexDirection:'column',paddingRight:20}}>
        <Text style={{color: privacy == 'private' ? colors.white : colors.rollingStone, fontSize:20,fontFamily:'Montserrat-Bold'}}>PRIVATE</Text>
      <Text style={{color: privacy == 'private' ? colors.white : colors.rollingStone,fontSize:18,fontFamily:'omnes',marginTop:5}}>
          Your profile is hidden from your facebook friends and phone contacts.
        </Text>
      </View>
      <View style={{width:30,marginHorizontal:10}}>
        <Image style={{width:40,height:40}} source={privacy == 'private' ? require('image!ovalSelected') : require('image!ovalDashed')}/>
      </View>
      </View>
    </TouchableHighlight>


    <View style={{paddingHorizontal: 25,}}>
        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Helpful Links</Text>
        </View>
</View>
        <TouchableHighlight style={{paddingHorizontal: 25,}} onPress={this.handleFeedback.bind(this)} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>FEEDBACK</Text>
          <Image style={{width:10,height:17.5}} source={require('image!nextArrow')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{paddingHorizontal: 25,}} onPress={(f)=>{
            this.openWebview('help')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>HELP</Text>
          <Image style={{width:10,height:17.5}} source={require('image!nextArrow')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{paddingHorizontal: 25,}} onPress={(f)=>{
            this.openWebview('privacy')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>PRIVACY POLICY</Text>
          <Image style={{width:10,height:17.5}} source={require('image!nextArrow')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{paddingHorizontal: 25,}} onPress={(f)=>{
            this.openWebview('terms')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>TERMS OF USE</Text>
          <Image style={{width:10,height:17.5}} source={require('image!nextArrow')} />
          </View>
        </TouchableHighlight>
        <View style={{paddingHorizontal: 25,}}>
          <LogOutButton/>
        <TouchableOpacity style={{alignItems:'center',marginVertical:10}} onPress={(f)=>{}}>
          <Text style={{color:colors.shuttleGray,textAlign:'center'}}>Disable Your Account</Text>
        </TouchableOpacity>

        </View>
        </ScrollView>
      </View>

    )

  }
}

export default SettingsSettings



class LogOutButton extends React.Component{
  _doLogOut(){
    AlertIOS.alert(
      'Log Out of Trippple',
      'Are you sure you want to log out?',
      [
        {text: 'Yes', onPress: () => {
          AsyncStorage.multiRemove(['ChatStore','MatchesStore'])
          .then(() => UserActions.logOut())
        }},
        {text: 'No', onPress: () => {return false}},
      ]
    )

  }
  render(){

    return (
      <TouchableHighlight underlayColor={colors.shuttleGray20} onPress={this._doLogOut} style={{marginVertical:20,marginTop:70}}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>LOG OUT OF TRIPPPLE</Text>
        </View>
      </TouchableHighlight>
    )
  }
}


var styles = StyleSheet.create({

  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'Montserrat'

  },
  button: {

    flexDirection: 'column',
    paddingVertical:20,
    backgroundColor: 'transparent',
    borderColor:colors.shuttleGray,
    borderWidth: 1,

    alignSelf: 'stretch',
    justifyContent: 'center'
  },
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
  //  overflow:'hidden'
 },
 inner:{
   flex: 1,
   alignItems: 'stretch',
   backgroundColor:colors.outerSpace,
   flexDirection:'column',
   justifyContent:'flex-start'
 },

 blur:{
   flex:1,
   alignSelf:'stretch',
   alignItems:'center',
   paddingTop: 60,
   paddingBottom: 40,

 },



 formHeader:{
   marginTop:40
 },
 formHeaderText:{
   color: colors.rollingStone,
   fontFamily: 'omnes'
 },
 formRow: {
   alignItems: 'center',
   flexDirection: 'row',

   alignSelf: 'stretch',
   paddingTop:0,
   height:50,
   flex:1,
   borderBottomWidth: 2,
   borderBottomColor: colors.rollingStone

 },
 tallFormRow: {
   width: 250,
   left:0,
   height:220,
   alignSelf:'stretch',
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center'
 },
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:200,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'flex-end',
   justifyContent:'center',
 },
 halfcell:{
   width:DeviceWidth / 2,
   alignItems: 'center',
   alignSelf:'center',
   justifyContent:'space-around'


 },

 formLabel: {
   flex: 8,
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 textfield:{
   color: colors.white,
   fontSize:20,
   alignItems: 'stretch',
   flex:1,
   textAlign: 'left',
   fontFamily:'Montserrat',
 },

});