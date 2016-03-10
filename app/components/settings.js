/* @flow */
import React, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  AlertIOS,
  TextInput,
  ScrollView,
  SwitchIOS,
  Animated,
  PickerIOS,
  Image,
  AsyncStorage,
  Navigator
} from 'react-native'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import PartnerMissingModal from '../modals/PartnerMissingModal'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';
import UserProfile from './UserProfile'
import dismissKeyboard from 'dismissKeyboard'
import {MagicNumbers} from '../DeviceConfig'
import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'
import DistanceSlider from '../controls/distanceSlider'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import CoupleImage from './loggedin/CoupleImage'
import FacebookButton from '../buttons/FacebookButton'
import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import EditPage from './EditPage'
import CloseButton from './CloseButton'
import Api from '../utils/api'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'
import SettingsBasic from './SettingsBasic'
import SettingsSettings from './SettingsSettings'
import SettingsPreferences from './SettingsPreferences'
import SettingsCouple from './SettingsCouple'
import SettingsDebug from './SettingsDebug'
import profileOptions from '../get_client_user_profile_options'
const PickerItemIOS = PickerIOS.Item;




class SettingsInside extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      index: 0,
      isModalOpen: true,
      settingOptions: profileOptions,
    }
  }
  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  componentDidMount() {

  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }
  // handleImages(imgs){
  //   UserActions.uploadImage(imgs.croppedImage,'profile')
  //
  //   navigator.jumpForward();
  // }

  _pressNewImage(){
    this.props.navigator.push({
      component: this.props.user.relationship_status == 'single' ? SelfImage : CoupleImage,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
      passProps: {
        user: this.props.user,
      }
    });
  }
  showPartnerMissingModal(){
    this.props.navigator.push({
      component: PartnerMissingModal,
      passProps: {
        nameOfDeniedAction: `view your couple profile `,
        goBack: () => {this.props.navigator.pop() },
      }
    })
  }

  _openProfile(){

    if(this.props.user.relationship_status == 'couple' && this.props.user.status != 'onboarded'){
      this.showPartnerMissingModal()
      return
    }else{
      var thisYear = new Date().getFullYear()

      const selfAsPotential = {
        user: {
          ...this.props.user,
          age: (thisYear - this.props.user.bday_year)
        },
      }
      if(this.props.user.relationship_status == 'couple'){
        // delete selfAsPotential.coupleImage;
        // delete selfAsPotential.partner;
        potential = {
          ...this.props.user.couple,
          user: selfAsPotential.user,
          partner: {
            ...this.props.user.partner,
            age: (thisYear - this.props.user.partner.bday_year)
          },
        };
      }else{
        potential = selfAsPotential
      }

      this.props.navigator.push({
        component: UserProfile,
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        passProps: {
          potential
        }
      });
    }
  }


  _updateAttr(updatedAttribute){
    this.setState(()=>{return updatedAttribute});
  }
  componentWillMount(){
  }

  render(){
    const { user } = this.props
    var src;
    var thumbSrc;
    if(user.localUserImage && user.localUserImage.uri){
      src = user.localUserImage.uri;
      thumbSrc = user.localUserImage.uri;
    }else if(user.localUserImage && !user.localUserImage.uri){
      src = user.localUserImage;
      thumbSrc = user.localUserImage.uri;
    }else if(!user.localUserImage && user.image_url && user.image_url.uri){
      src = user.image_url.uri;
      thumbSrc = user.thumb_url.uri;
    }else if(!user.localUserImage && user.image_url && !user.image_url.uri){
      src = user.image_url;
      thumbSrc = user.thumb_url;
    }



    if(user.relationship_status == 'couple'){


      if(user.localCoupleImage && user.localCoupleImage.uri){
        src = user.localCoupleImage.uri;
        thumbSrc = user.localCoupleImage.uri;
      }else if(user.localCoupleImage && !user.localCoupleImage.uri){
        src = user.localCoupleImage;
        thumbSrc = user.localCoupleImage;
      }else if(!user.localCoupleImage && user.couple && user.couple.image_url && user.couple.image_url.uri){
        src = user.couple.image_url.uri;
        thumbSrc = user.couple.thumb_url.uri;
      }else if(!user.localCoupleImage && user.couple && user.couple.image_url && !user.couple.image_url.uri){
        src = user.couple.image_url;
        thumbSrc = user.couple.thumb_url;
      }

    }

    return (
      <View style={{flex:1,}}>

          <ParallaxView
              showsVerticalScrollIndicator={false}
              key={this.props.user.id}
              windowHeight={DeviceHeight*0.6}
              navigator={this.props.navigator}
              backgroundSource={{uri:src}}
              style={{backgroundColor:colors.outerSpace,paddingTop:0,}}
              header={(
              <View
                  style={[
                  styles.userimageContainer,styles.blur,
                  {
                  justifyContent:'center',
                  flexDirection:'column'
                  }]}
              >

                  <TouchableOpacity
                      onPress={this._pressNewImage.bind(this)}
                      style={{marginTop:20,}}
                  >
                      <Image
                          style={[ styles.userimage, { backgroundColor:colors.dark}]}
                          key={this.props.user.id+'thumb'}
                          defaultSource={{uri: 'assets/placeholderUserWhite@3x.png'}}
                          resizeMode={Image.resizeMode.cover}
                          source={{uri:thumbSrc}}

                      />
                      <View style={{width:35,height:35,borderRadius:17.5,backgroundColor:colors.mediumPurple,position:'absolute',top:8,left:8,justifyContent:'center',alignItems:'center'}}>
                          <Image
                              style={{width:18,height:18}}
                              source={{uri: 'assets/cog@3x.png'}}
                              resizeMode={Image.resizeMode.contain}
                          />
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._openProfile.bind(this)}  style={{alignSelf:'stretch',}} >
                      <View style={{flex:10,alignSelf:'stretch',flexDirection:'column',alignItems:'stretch',justifyContent:'center'}}>
                          <Text style={{flex:10,textAlign:'center',alignSelf:'stretch',color:colors.white,fontSize:18,marginTop:20,fontFamily:'Montserrat-Bold'}}>{
                          this.props.user.firstname && this.props.user.firstname.toUpperCase()
                          }</Text>
                      </View>
                      <View style={{flex:1,alignSelf:'stretch',flexDirection:'column',alignItems:'stretch',justifyContent:'center'}}>
                          <Text style={{flex:1,alignSelf:'stretch',textAlign:'center',color:colors.white,fontSize:16,marginTop:0,fontFamily:'omnes'}}>View Profile</Text>
                      </View>
                  </TouchableOpacity>


              </View>
          )}>

          <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,marginBottom:30}}>
              <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push({
                  component: SettingsBasic,
                  sceneConfig:NavigatorSceneConfigs.FloatFromRight,
                  user:this.props.user,
                  id:'settingsbasic',
                  passProps: {
                  style:styles.container,
                  settingOptions:this.state.settingOptions,
                  user:this.props.user
                  }
                  })
                  }} underlayColor={colors.dark}>
                  <View  style={styles.wrapfield}>
                      <View>
                          <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>BASIC</Text>
                          <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                          Your personal information and details
                          </Text>
                      </View>
                      <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                  </View>
              </TouchableHighlight>


              {this.props.user.relationship_status == 'couple' ?
                  <TouchableHighlight onPress={(f)=>{
                      this.props.navigator.push({
                      component: SettingsCouple,
                      sceneConfig:NavigatorSceneConfigs.FloatFromRight,
                      passProps: {
                      style:styles.container,
                      settingOptions:this.state.settingOptions,
                      user:this.props.user,
                      navigator:this.props.navigator
                      }
                      })
                      }} underlayColor={colors.dark}>
                      <View  style={styles.wrapfield}>
                          <View>
                              <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>COUPLE</Text>
                              <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                              You and your partner
                              </Text>
                          </View>
                          <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                      </View>
                  </TouchableHighlight>
              : null }



              <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push({
                  component: SettingsPreferences,
                  sceneConfig:NavigatorSceneConfigs.FloatFromRight,
                  passProps: {
                  style:styles.container,
                  settingOptions:this.state.settingOptions,
                  user:this.props.user,
                  navigator:this.props.navigator
                  }
                  })
                  }} underlayColor={colors.dark} >
                  <View  style={styles.wrapfield}>
                      <View>
                          <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>PREFERENCES</Text>
                          <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                          What you're looking for
                          </Text>
                      </View>
                      <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                  </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push({
                  component: SettingsSettings,
                  sceneConfig:NavigatorSceneConfigs.FloatFromRight,
                  passProps: {
                  style:styles.container,
                  settingOptions:this.state.settingOptions,
                  user:this.props.user,
                  navigator:this.props.navigator
                  }
                  })
                  }} underlayColor={colors.dark}>
                  <View  style={styles.wrapfield}>
                      <View>
                          <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>SETTINGS</Text>
                          <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                          Privacy and more
                          </Text>
                      </View>
                      <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                  </View>
              </TouchableHighlight>

              { __DEV__ && <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push({
                  component: SettingsDebug,
                  sceneConfig:NavigatorSceneConfigs.FloatFromBottom,
                  passProps: {
                  style:styles.container,
                  settingOptions:this.state.settingOptions,
                  user:this.props.user,
                  navigator:this.props.navigator
                  }
                  })
                  }} underlayColor={colors.dark} >
                  <View  style={styles.wrapfield}>
                      <View>
                          <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>DEBUG</Text>
                          <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                          stuff
                          </Text>
                      </View>
                      <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                  </View>
              </TouchableHighlight>
              }
          </View>
      </ParallaxView>
      </View>
    )
  }
}


class Settings extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  openModal(page: string){ this.setState({isModalOpen: page}) }

  closeModal(){ this.setState({isModalOpen: false}) }

  render(){
    return (
      <View style={styles.container}>
          <SettingsInside user={this.props.user} openModal={this.openModal.bind(this)} navigator={this.props.navigator}/>
          <FakeNavBar
              blur={false}
              backgroundStyle={{backgroundColor:colors.shuttleGray}}
              hideNext={true}
              navigator={this.props.navigator}
              customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'center',top:10,justifyContent:'center',height:12,width:12}} source={{uri: 'assets/close@3x.png'}}/>}
          onPrev={(nav,route)=> nav.pop()}
          title={'MANAGE YOUR ACCOUNT'}
          titleColor={colors.white}
      />
      </View>
    )
  }
}
export default Settings



const styles = StyleSheet.create({


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

 userimageContainer: {
   padding: 0,
   alignItems: 'center'

 },
 blur:{
   flex:1,
   alignSelf:'stretch',
   alignItems:'center',
   paddingTop: 60,
   paddingBottom: 20,

 },
 closebox:{
   height:40,
   width:40,
   backgroundColor:'blue'
 },
 userimage: {
   padding:0,
   width: DeviceWidth/2 - 20,
   height: DeviceWidth/2 - 20 ,
   alignItems: 'center',
   borderRadius:((DeviceWidth/2 - 20)/2),
   overflow:'hidden'
 },
 changeImage: {
  //  position:'absolute',
   color:colors.white,
   fontSize:22,
  //  right:0,
   fontFamily:'omnes',
   alignItems:'flex-end'
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
   borderBottomWidth: StyleSheet.hairlineWidth,
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
 wrapfield:{
   borderBottomWidth: StyleSheet.hairlineWidth,
   borderColor:colors.shuttleGray,
   height:80,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5
 },
 privacy:{
   height:100,
   alignItems: 'center',
   flexDirection: 'column',
   paddingVertical: 30,
   paddingHorizontal:20
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
 buttonText: {
   fontSize: 18,
   color: '#111',
   alignSelf: 'center',
   fontFamily:'omnes'

 },
 button: {
   height: 45,
   flexDirection: 'row',
   backgroundColor: '#FE6650',
   borderColor: '#111',
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   marginTop: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
 },
 modal:{
   padding:0,
   height:DeviceHeight - 100,
   flex:1,
   alignItems: 'stretch',
   alignSelf: 'stretch',
  //  position:'absolute',
  //  top:0

 },
 modalwrap:{
   padding:0,
   paddingLeft:0,
   paddingRight:0,
   paddingTop:0,
   margin:0,
   paddingBottom:0,
   backgroundColor:'red'
 },
segmentTitles:{
  color:colors.white,
  fontFamily:'Montserrat'
},
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
    width:DeviceWidth/3,

  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: -10,
    borderWidth: 1,
    flex:1,
    backgroundColor:colors.dark,
    width:DeviceWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: colors.dark,
  },

});
