/* @flow */


import React, {
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
  NativeModules,
  AsyncStorage,
  Navigator
} from  'react-native'
import base64 from 'base-64';
import Log from '../Log';

import Mixpanel from '../utils/mixpanel';
import FakeNavBar from '../controls/FakeNavBar';
import alt from '../flux/alt'
import RNFS from 'react-native-fs'
const {RNMail,ReactNativeAutoUpdater} = NativeModules
import {MagicNumbers} from '../DeviceConfig'
import dismissKeyboard from 'dismissKeyboard'
import WebViewScreen from './WebViewScreen'
import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import PrivacyPermissionsModal from '../modals/PrivacyPermissions';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import CloseButton from './CloseButton'
import Api from '../utils/api'
import FieldModal from './FieldModal'
import AppTelemetry from '../AppTelemetry'

let ACTUAL_VERSION = ReactNativeAutoUpdater.jsCodeVersion

Log(ACTUAL_VERSION)


class SettingsSettings extends React.Component{
  constructor(props){
    super()
    this.state = {
      privacy: props.user.privacy || 'public'
    }
  }
  togglePrivacy(value){
    var payload = {privacy: value}
    UserActions.updateUser(payload)
    this.setState(payload)
  }
  componentDidMount() {
    Mixpanel.track('On - Setings Screen');
  }

  disableAccount(){
    AlertIOS.alert(
      'Disable Your Account?',
      'Are you sure you want to quit Trippple?',
      [
        {text: 'Yes', onPress: () => {
          UserActions.disableAccount();
        }},
        {text: 'No', onPress: () => {return false}},
      ]
    )

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
        pageTitle = 'TERMS OF USE';
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

  async handleFeedback() {
    var snapshot = alt.takeSnapshot();
    var {settings} = React.NativeModules.SettingsManager
    var fileName = 'trippple-feedback'+ Date.now() +'.ttt'
    var path = RNFS.DocumentDirectoryPath + '/' + fileName

    try{
    var fileContents = await AppTelemetry.getEncoded()

      RNFS.writeFile(path, (fileContents))
      .then((success) => {
        RNMail.mail({
          subject: `I'm having an issue in the app`,
          recipients: ['hello@trippple.co'],
          body:  'Help!',
          attachment: {
            path,  // The absolute path of the file from which to read data.
            type: 'text',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: fileName
          }
        }, (error, event) => {
            if(error) {
              AlertIOS.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
            }
        });
      })
      .catch((err) => {
            Log('cant send mail',err)
      });
    }catch(err){
            Log('cant send mail',err)

    }
  }
  handleTapPrivacy(){
    if(this.state.privacy != 'private'){
        this.props.navigator.push({
          component: PrivacyPermissionsModal,
          title: '',
          id:'privacymodal',
          sceneConfig: NavigatorSceneConfigs.FloatFromBottom,
          passProps: {
            cancel: ()=> {this.props.navigator.pop()},
            success: (privacy) => {
              this.props.navigator.pop();
              this.togglePrivacy('private');
            },
            user: this.props.user,
          }
        })
    }
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};

    var {privacy} = this.state

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
          <ScrollView style={{flex:1,marginTop:54}} contentContainerStyle={{   paddingHorizontal: 0}} centerContent={true} >
            <View style={styles.paddedSpace}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Privacy</Text>
              </View>
            </View>
        <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.togglePrivacy('public')}}>
          <View  style={[{
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor:colors.rollingStone,flex:1,height:130,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
          <View style={{flexWrap:'wrap',alignSelf:'stretch',flex:1,alignItems:'flex-start',justifyContent:'center',width:DeviceWidth-120,flexDirection:'column',paddingRight:20}}>
            <Text style={{color: privacy == 'public' ? colors.white : colors.rollingStone, fontSize:20,fontFamily:'Montserrat-Bold'}}>PUBLIC</Text>
          <Text style={{
              color: privacy == 'public' ? colors.white : colors.rollingStone,fontSize:18,
              fontFamily:'omnes',marginTop:5}}>
                Your profile is visible to all Trippple members.
                  </Text>
                </View>
                <View style={{width:30,marginHorizontal:10}}>
                  <Image style={{width:40,height:40}} source={privacy == 'public' ? require('../../assets/ovalSelected.png') : require('../../assets/ovalDashed.png')}/>
                </View>
                </View>
              </TouchableHighlight>

    <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={this.handleTapPrivacy.bind(this)}>
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
        <Image style={{width:40,height:40}} source={privacy == 'private' ? require('../../assets/ovalSelected.png') : require('../../assets/ovalDashed.png')}/>
      </View>
      </View>
    </TouchableHighlight>


    <View style={styles.paddedSpace}>
        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Helpful Links</Text>
        </View>
</View>
        <TouchableHighlight style={styles.paddedSpace} onPress={this.handleFeedback.bind(this)} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>FEEDBACK</Text>
          <Image style={{width:10,height:17.5}} source={require('../../assets/nextArrow.png')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.paddedSpace} onPress={(f)=>{
            this.openWebview('help')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>HELP</Text>
          <Image style={{width:10,height:17.5}} source={require('../../assets/nextArrow.png')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.paddedSpace} onPress={(f)=>{
            this.openWebview('privacy')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>PRIVACY POLICY</Text>
          <Image style={{width:10,height:17.5}} source={require('../../assets/nextArrow.png')} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.paddedSpace} onPress={(f)=>{
            this.openWebview('terms')
          }} underlayColor={colors.dark}>
          <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>TERMS OF USE</Text>
          <Image style={{width:10,height:17.5}} source={require('../../assets/nextArrow.png')} />
          </View>
        </TouchableHighlight>

        <View style={[styles.paddedSpace,{marginTop:20}]}>

            <Text style={{color:colors.white,textAlign:'center',fontSize:15,fontFamily:'omnes'}}>Trippple {ACTUAL_VERSION}</Text>

        </View>

        <View style={styles.paddedSpace}>

          <LogOutButton/>
        <TouchableOpacity style={{alignItems:'center',marginVertical:10}} onPress={this.disableAccount.bind(this)}>
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
          UserActions.logOut()
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


const styles = StyleSheet.create({

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
 paddedSpace:{
   paddingHorizontal:MagicNumbers.screenPadding/2
 }

});
