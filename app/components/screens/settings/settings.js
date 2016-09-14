import React from "react";
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  PickerIOS,
  Image,
  NativeModules,
  Dimensions,
} from 'react-native';

const PickerItemIOS = PickerIOS.Item;

import Analytics from '../../../utils/Analytics';
import Coupling from '../coupling';
import LogoutButton from '../../buttons/LogoutButton';
import XButton from '../../buttons/XButton';
import FacebookImageSource from '../FacebookImageSource';
import SettingsBasic from './SettingsBasic';
import SettingsCouple from './SettingsCouple';
import SettingsDebug from './SettingsDebug';
import SettingsPreferences from './SettingsPreferences';
import SettingsSettings from './SettingsSettings';
import UserProfile from '../../UserProfile';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import profileOptions from '../../../data/get_client_user_profile_options'
import FBPhotoAlbums from '../../FBPhotoAlbums'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {RNHotlineController,FBAppInviteDialog} = NativeModules;
const RNHotlineView = ReactNative.requireNativeComponent('RNHotlineView')
import ParallaxView from '../../controls/ParallaxScrollView'
import dismissKeyboard from 'dismissKeyboard'
import ActionMan from '../../../actions/'
import { connect } from 'react-redux';
import {
  NavigationStyles,
} from '@exponent/ex-navigation';




class Settings extends React.Component{
  static route = {
    styles: NavigationStyles.FloatVertical,
    navigationBar: {
      visible:false,
    }
  };

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }
  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      settingOptions: profileOptions,
    }

  }

  disableAccount(){


    Analytics.event('Interaction',{
      name: 'Disable Account',
      type: 'tap',
    })

    Alert.alert(
        'Delete Your Account?',
        'Are you sure you want to delete your account? You will no longer be visible to any trippple users.',
      [
          {text: 'Yes', onPress: () => {

            Analytics.event('Support',{
              name: 'Disabled Account',
              type: this.props.user.id,
              user:this.props.user
            })

            this.props.dispatch(ActionMan.disableAccount())
          }},
          {text: 'No', onPress: () => {

            return false
          }},
      ]
      )

  }

  _openProfile(){
    Analytics.event('Interaction',{type:'tap', name: 'Preview self profile' });
    var thisYear = new Date().getFullYear()
    const {bday_year} = this.props.user
    const age = (thisYear - bday_year)
    const selfAsPotential = {
      user: { ...this.props.user, age },
    }
    let potential;
    if(this.props.user.relationship_status == 'couple'){
            // delete selfAsPotential.coupleImage;
            // delete selfAsPotential.partner;
      potential = {
        couple:this.props.user.couple,
        user: selfAsPotential.user,
        partner: {
          ...this.props.user.partner,
          age: (thisYear - this.props.user.partner.bday_year)
        },
      };
    }else{
      potential = selfAsPotential
    }

    this.props.navigator.push(this.props.navigation.router.getRoute('UserProfile',{potential,user:this.props.user}));
  }

  _pressNewImage(){

    this.props.navigator.push(this.props.navigation.router.getRoute('FBPhotoAlbums',{}));


  }

  _updateAttr(updatedAttribute){
    this.setState(()=>{return updatedAttribute});
  }
  render(){
    const wh = DeviceHeight/2;
    return (
          <View style={{backgroundColor:colors.outerSpace,paddingTop:0,flex:1}} pointerActions={'box-none'}>
              <ParallaxView
                showsVerticalScrollIndicator={false}
                key={this.props.user.id}
                windowHeight={wh}
                navigator={this.props.navigator}
                automaticallyAdjustContentInsets={true}
                scrollsToTop={true}
                backgroundSource={{uri:this.props.user.image_url || 'assets/defaultuser.png'}}
                style={{backgroundColor:colors.outerSpace, zIndex:100,flex:1,paddingTop:0,height:DeviceHeight}}
                header={(
                <View
                    style={[ styles.userimageContainer, {
                      justifyContent:'center',
                      height:wh,
                      zIndex:100,
                      flexDirection:'column',
                      alignSelf:'center',
                      alignItems:'center',
                      width: DeviceWidth/2
                    }]}
                >
                <TouchableOpacity
                  onPress={this._pressNewImage.bind(this)}
                  style={{marginTop:0,}}
                >
                  <View>
                    <Image
                    style={[ styles.userimage, { backgroundColor:colors.dark}]}
                    key={this.props.user.id+'thumb'}
                    defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                    resizeMode={Image.resizeMode.cover}
                    source={{uri:this.props.user.thumb_url || 'assets/placeholderUser@3x.png'}}
                  />
                    <View style={styles.circle}>
                      <Image
                        style={{width:18,height:18}}
                        source={{uri: 'assets/cog@3x.png'}}
                        resizeMode={Image.resizeMode.contain}
                        />
                      </View>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._openProfile.bind(this)}  style={{alignSelf:'stretch',}} >
                      <View style={{alignSelf:'stretch',flexDirection:'column',alignItems:'stretch',justifyContent:'center'}}>
                        <Text style={{textAlign:'center',alignSelf:'stretch',color:colors.white,fontSize:18,marginTop:20,fontFamily:'Montserrat-Bold'}}>{
                          this.props.user.firstname && this.props.user.firstname.toUpperCase()
                        }</Text>
                    </View>
                    <View style={{alignSelf:'stretch',flexDirection:'column',alignItems:'stretch',justifyContent:'center'}}>
                      <Text style={{alignSelf:'stretch',textAlign:'center',color:colors.white,fontSize:16,marginTop:0,fontFamily:'omnes'}}>View Profile</Text>
                    </View>
                  </TouchableOpacity>


                </View>
            )}>

            <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,marginBottom:100}}>
                <TouchableHighlight onPress={(f)=>{

                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsBasic',{
                    style:styles.container,
                    settingOptions:profileOptions,
                    startPage:0,
                    navigation: this.props.navigation,
                    navigator: this.props.navigator

                  }));



                }} underlayColor={colors.dark}>
                    <View  style={styles.wrapfield}>
                        <View>
                          <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>PROFILE</Text>
                          {/*  <Text style={{color:colors.sushi}}>✔︎</Text> */}
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            Edit your information
                            </Text>
                        </View>
                        <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />

                    </View>
                </TouchableHighlight>

                {this.props.user.relationship_status == 'couple' ?

                    <TouchableHighlight onPress={(f)=>{
                      this.props.navigator.push(this.props.navigation.router.getRoute('SettingsCouple',{
                        style:styles.container,
                        settingOptions:this.state.settingOptions,
                        user:this.props.user,
                        navigator:this.props.navigator,
                        dispatch: this.props.dispatch,
                        navigation: this.props.navigation
                      }));
                    }} underlayColor={colors.dark}>
                        <View  style={styles.wrapfield}>
                            <View>
                              <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>COUPLE</Text>
                                <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                                You and your partner, {this.props.user.partner ? this.props.user.partner.firstname : ''}
                                </Text>
                            </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />
                        </View>
                    </TouchableHighlight> : null }

                {this.props.user.relationship_status == 'single' ?
                    <TouchableHighlight onPress={(f)=>{
                      this.props.dispatch(ActionMan.showInModal({
                        component: Coupling,
                        passProps: {},
                      }))
                    }} underlayColor={colors.dark}>
                        <View  style={styles.wrapfield}>
                            <View>
                                <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>JOIN COUPLE</Text>
                                <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                                Connect with your partner
                                </Text>
                            </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />
                        </View>
                    </TouchableHighlight>
                : null }


                <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsPreferences', {
                    style:styles.container,
                    settingOptions:this.state.settingOptions,
                    user:this.props.user,
                    
                  }));

                }} underlayColor={colors.dark} >
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>PREFERENCES</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            What you're looking for
                            </Text>
                        </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />


                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsSettings', {
                    style:styles.container,
                    settingOptions:this.state.settingOptions,
                    user:this.props.user,
                    navigator:this.props.navigator,
                    dispatch: this.props.dispatch,
                    navigation: this.props.navigation
                  }));
                }} underlayColor={colors.dark}>
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>SETTINGS</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            Privacy and more
                            </Text>
                        </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />


                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={(f)=>{
                  const applinkUrl = 'https://fb.me/656380827843911';
                  FBAppInviteDialog.show({applinkUrl})
                }} underlayColor={colors.dark}>
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>INVITE FRIENDS</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            Spread the word
                            </Text>
                        </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />


                    </View>
                </TouchableHighlight>



                <TouchableHighlight onPress={(f)=>{
                  RNHotlineController.showFaqs()
                }} underlayColor={colors.dark}>
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>FAQS</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            Answers to frequently asked questions
                            </Text>
                        </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />


                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={(f)=>{ RNHotlineController.showConvos() }} underlayColor={colors.dark}>
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>HELP & FEEDBACK</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            Chat with us
                            </Text>
                        </View>
                        <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />
                    </View>
                </TouchableHighlight>

                { __DEV__ && <TouchableHighlight onPress={(f)=>{
                  this.props.navigator.push(this.props.navigation.router.getRoute('SettingsDebug', {
                    style:styles.container,
                    settingOptions:this.state.settingOptions,
                    user:this.props.user,
                    dispatch: this.props.dispatch,
                  }))

                }} underlayColor={colors.dark} >
                    <View  style={styles.wrapfield}>
                        <View>
                            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>DEBUG</Text>
                            <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                            stuff
                            </Text>
                        </View>
                            <Image source={{uri: 'assets/nextArrow@3x.png'}} resizeMode={'contain'} style={styles.arrowStyle}  />


                    </View>
                </TouchableHighlight>
                }

                <View style={styles.paddedSpace}>

                  <LogoutButton dispatch={this.props.dispatch}/>

                  <TouchableOpacity
                    style={{alignItems:'center',marginVertical:10}}
                    onPress={this.disableAccount.bind(this)}>
                    <Text style={{color:colors.mandy,textAlign:'center', textDecorationLine: "underline"}}>
                      Delete My Account
                    </Text>
                  </TouchableOpacity>

                </View>


          <View style={[styles.paddedSpace,{marginTop:20,paddingVertical:20}]}>

            <Text style={{color:colors.white,textAlign:'center',fontSize:15,fontFamily:'omnes'}}>
              Trippple {ReactNative.NativeModules.RNDeviceInfo.appVersion}
            </Text>
            {__DEV__ &&

               <Text style={{color:colors.white,textAlign:'center',fontSize:15,fontFamily:'omnes'}}>
              build {ReactNative.NativeModules.RNDeviceInfo.buildNumber}
            </Text>
            }
          </View>

            </View>

        <XButton navigator={this.props.navigator}/>


        </ParallaxView>



</View>


     )
  }
}

Settings.displayName = "Settings"

const mapStateToProps = ({user,ui}, ownProps) => {
  return {...ownProps, user, ui }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);



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
    paddingTop: 0,
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
  arrowStyle:{
    tintColor:colors.shuttleGray,
    opacity:0.4,
    width:12,
    height:12
  },
  wrapfield:{
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor:colors.shuttleGray,
    height:80,
  //  backgroundColor:colors.outerSpace,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    paddingRight:MagicNumbers.screenPadding/2,
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
  paddedSpace:{
    paddingHorizontal:MagicNumbers.screenPadding/1.5
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
  circle:{
    width:35,
    height:35,
    borderRadius:17.5,
    backgroundColor:colors.mediumPurple,
    position:'absolute',
    top:8,
    left:8,
    justifyContent:'center',
    alignItems:'center'
  }

});
