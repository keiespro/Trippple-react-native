import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  PixelRatio,
  Dimensions,
  Image,
  Settings,
} from 'react-native';
import React from "react";

import Analytics from '../../../utils/Analytics';
import ActionMan from '../../../actions';
import WebViewScreen from '../../WebViewScreen';
import colors from '../../../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../../utils/DeviceConfig'
import TouchID from 'react-native-touch-id'

const ACTUAL_VERSION = '2.5';


class SettingsSettings extends React.Component{
  constructor(props){
    super()
    const settings = Settings._settings || {}
    this.state = {
      privacy: props.user.privacy || 'public',
      isLocked: settings['LockedWithTouchID'] || null
    }
  }
  togglePrivacy(value){
    var payload = {privacy: value}
    this.props.store.dispatch(ActionMan.updateUser(payload))
    this.setState(payload)
  }
  componentDidMount() {

    TouchID.isSupported()
      .then(supported => {
        // Success code
        this.setState({
          touchIDSupported: true
        })

      })
      .catch(error => {
        // Failure code
        Analytics.err(error)
      });

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

    Analytics.event('Interaction',{
      name: `${pageTitle}`,
      type: 'tap',
    })

    this.props.navigator.push({
      component: WebViewScreen,
      title: '',
      name:pageTitle,
      id:'webview',
      sceneConfig: NavigatorSceneConfigs.PushFromRight,
      passProps: {
        source:{uri:url},
        pageTitle
      }
    })
  }

  handleFeedback() {


  }
  handleTapPrivacy(){


    Analytics.event('Interaction',{
      name: `Privacy - Private`,
      type: 'tap',
    })

    if(this.state.privacy != 'private'){
      this.props.store.dispatch(ActionMan.showInModal({
            component:PrivacyPermissionsModal,
            name: 'PrivacyPermissionsModal',
            id:'privacymodal',
            passProps:{
              initialScreen:'CoupleReady',
              cancel: ()=>{this.props.store.dispatch(ActionMan.killModal())},
              success: (privacy) => {
                this.togglePrivacy('private')
              },
              user: this.props.user,

            }
          }))

        //
        // this.props.navigator.push({
        //   component: PrivacyPermissionsModal,
        //   title: '',
        //   name: 'PrivacyPermissionsModal',
        //   id:'privacymodal',
        //   sceneConfig: NavigatorSceneConfigs.FloatFromBottom,
        //   passProps: {
        //     cancel: ()=> {this.props.navigator.pop()},
        //     success: (privacy) => {
        //       this.props.navigator.pop();
        //       this.togglePrivacy('private');
        //     },
        //     user: this.props.user,
        //   }
        // })
    }
  }

  handleLockWithTouchID(){

    Analytics.event('Interaction',{
      name: `Touch Id`,
      type: 'tap',
      value: !this.state.isLocked
    })

    TouchID.authenticate(this.state.isLocked ? 'Disable TouchID Lock' : 'Lock Trippple')
      .then((success) => {
        var shouldLock = this.state.isLocked ? 1 : null

        this.setState({
          isLocked: !shouldLock
        })
        Settings.set({LockedWithTouchID:this.state.isLocked})

          Analytics.extra('Permission',{
            name: (shouldLock ? `Enable` : `Disable`) + 'Touch ID lock',
            action: 'tap',
          })

        // Success code
      })
      .catch(error => {
        // Failure code

                // Alert.alert('Sorry')

      });
  }

  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};

    var {privacy} = this.state

    return (
      <View style={styles.inner}>

        <ScrollView
          style={{height:DeviceHeight,marginTop: 0}}
          contentContainerStyle={{paddingHorizontal: 0}}
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paddedSpace}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Privacy</Text>
            </View>
          </View>

          <TouchableHighlight
            underlayColor={colors.dark}
            style={styles.paddedSpace}
            onPress={()=>{this.togglePrivacy('public')}}
          >
            <View style={[{
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor:colors.rollingStone,flex:1,height:130,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}
            >
              <View
                style={{flexWrap:'wrap',alignSelf:'stretch',flex:1,alignItems:'flex-start',justifyContent:'center',width:DeviceWidth-120,flexDirection:'column',paddingRight:20}}
              >
                <Text style={{color: privacy == 'public' ? colors.white : colors.rollingStone, fontSize:20,fontFamily:'Montserrat-Bold'}}>PUBLIC</Text>
                <Text style={{
                  color: privacy == 'public' ? colors.white : colors.rollingStone,fontSize:18,
                  fontFamily:'omnes',marginTop:5}}>
                  Your profile is visible to all Trippple members.
                </Text>
              </View>
              <View style={{width:30,marginHorizontal:10}}>
                <Image
                  style={{width:40,height:40}}
                  source={privacy == 'public' ? {uri: 'assets/ovalSelected@3x.png'} : {uri: 'assets/ovalDashed@3x.png'}}/>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={colors.dark}
            style={styles.paddedSpace}
            onPress={this.handleTapPrivacy.bind(this)}
          >
            <View style={[{
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor:colors.rollingStone,flex:1,height:130,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}
            >
              <View
                style={{flexWrap:'wrap',alignSelf:'stretch',flex:1,alignItems:'flex-start',justifyContent:'center',width:DeviceWidth-120,flexDirection:'column',paddingRight:20}}>
                <Text style={{color: privacy == 'private' ? colors.white : colors.rollingStone, fontSize:20,fontFamily:'Montserrat-Bold'}}>PRIVATE</Text>
                <Text style={{color: privacy == 'private' ? colors.white : colors.rollingStone,fontSize:18,fontFamily:'omnes',marginTop:5}}>
                  Your profile is hidden from your facebook friends and phone contacts.
                </Text>
              </View>
              <View style={{width:30,marginHorizontal:10}}>
                <Image
                  style={{width:40,height:40}}
                  source={privacy == 'private' ? {uri: 'assets/ovalSelected@3x.png'} : {uri:
                  'assets/ovalDashed@3x.png'}}/>
              </View>
            </View>
          </TouchableHighlight>

          {this.state.touchIDSupported ?
          <View>
            <View style={styles.paddedSpace}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>TouchID</Text>
              </View>
            </View>

            <TouchableHighlight
              style={styles.paddedSpace}
              onPress={this.handleLockWithTouchID.bind(this)}
              underlayColor={colors.dark}>
              <View style={{borderBottomWidth:1 / PixelRatio.get(), borderColor:colors.shuttleGray,height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>
                  Lock with TouchID
                </Text>
                <Image
                  style={{width:30,height:30}}
                  source={this.state.isLocked ? {uri: 'assets/ovalSelected@3x.png'} :
                  {uri: 'assets/ovalDashed@3x.png'}} />
              </View>
            </TouchableHighlight>
          </View>
          : null }



          <View style={styles.paddedSpace}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>
                Helpful Links
              </Text>
            </View>
          </View>

          <TouchableHighlight
            style={styles.paddedSpace}
            onPress={(f)=>{
              this.openWebview('privacy')
            }}
            underlayColor={colors.dark}>
            <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
              <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>
                PRIVACY POLICY
              </Text>
              <Image
                style={{width:10,height:17.5}}
                source={{uri: 'assets/nextArrow@3x.png'}} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.paddedSpace}
            onPress={(f)=>{
              this.openWebview('terms')
            }}
            underlayColor={colors.dark}>
            <View  style={{borderBottomWidth:1 / PixelRatio.get(),borderColor:colors.shuttleGray,height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
              <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat'}}>
                TERMS OF USE
              </Text>
              <Image
                style={{width:10,height:17.5}}
                source={{uri: 'assets/nextArrow@3x.png'}} />
            </View>
          </TouchableHighlight>

          <View style={[styles.paddedSpace,{marginTop:20,paddingVertical:20}]}>

            <Text style={{color:colors.white,textAlign:'center',fontSize:15,fontFamily:'omnes'}}>
              Trippple {ACTUAL_VERSION}
            </Text>

          </View>


        </ScrollView>
        {/* <FakeNavBar
          backgroundStyle={{backgroundColor:colors.shuttleGray}}
          hideNext={true}
          navigator={this.props.navigator}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
              <Text
                textAlign={'left'}
                style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
          }
          onPrev={(nav,route)=> nav.pop()}
          title={`SETTINGS`}
          titleColor={colors.white}
        /> */}
      </View>

    )

  }
}
SettingsSettings.displayName = "SettingsSettings"

export default SettingsSettings



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
   paddingTop: 0,
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
