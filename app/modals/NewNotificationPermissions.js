/* @flow */


import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, NativeModules, Settings, View, AppState, TouchableHighlight, Dimensions, PixelRatio, ScrollView, PushNotificationIOS, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import UrlHandler from 'react-native-url-handler'
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'
import NotificationActions from '../flux/actions/NotificationActions'
import {MagicNumbers} from '../DeviceConfig'
import { BlurView,VibrancyView} from 'react-native-blur'
import PotentialsStore from '../flux/stores/PotentialsStore'
import AltContainer from 'alt-container/native';

import { HAS_SEEN_NOTIFICATION_REQUEST, LAST_ASKED_NOTIFICATION_PERMISSION, NOTIFICATION_SETTING, LEGACY_NOTIFICATION_SETTING } from '../utils/SettingsConstants'


const failedTitle = `ALERTS DISABLED`,
      failedSubtitle = `Notification permissions have been disabled. You can enable them in Settings`,
      buttonText = `YES, ALERT ME`;

class NewNotificationPermissionsInside extends React.Component{
  static propTypes = {
    relevantUser: PropTypes.object //user
  };

  static defaultProps = {
    buttonText: 'YES',
    relevantUser: {
    }
  };

  constructor(props){
      super()
      this.state = {
        failedState: false,
        permissions: null,
        hasPermission: null
      }
    }

    componentWillMount(){
      this.checkPermission()
    }
    componentDidMount(){
      Settings.set({
        // [HAS_SEEN_NOTIFICATION_REQUEST]: true,
        [LAST_ASKED_NOTIFICATION_PERMISSION]: Date.now()
      })
      // AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    }

    componentWillUnmount() {
      // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
      PushNotificationIOS.removeEventListener('register', this.handleNotificationPermission.bind(this));

    }
    checkPermission(){
      PushNotificationIOS.checkPermissions((permissions) => {
        const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
          acc = acc + permissions[el];
          return acc
        },0);

        // this.setState({permissions, hasPermission: permResult > 0})

      })
    }
    // componentDidUpdate(prevProps,prevState){
    //   if(!prevState.hasPermission && this.state.hasPermission ){
    //     // this.props.failCallback(true)
    //   }
    // }
    cancel(){
      this.props.close && this.props.close()
    }

    handleNotificationPermission(token){

      __DEV__ && console.log('APN -> ',token);
      NotificationActions.receiveApnToken(token)
      // this.setState({ hasPermission: true})
      AppActions.disableNotificationModal()
      this.props.close && this.props.close(false)
      Settings.set({
        [HAS_SEEN_NOTIFICATION_REQUEST]: true,
        [NOTIFICATION_SETTING]: true
      })


    }
    handleTapYes(){
      if(this.state.failedState){
        UrlHandler.openUrl(UrlHandler.settingsUrl)

      }else{
        PushNotificationIOS.checkPermissions((permissions) => {
          const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
            acc = acc + permissions[el];
            return acc
          },0);

          if(permResult == 0){

            PushNotificationIOS.addEventListener('register', this.handleNotificationPermission.bind(this))
            PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})
            AppActions.disableNotificationModal()

          }else{
            AppActions.disableNotificationModal()

            this.props.close(false)
            this.props.successCallback && this.props.successCallback();
          }

        })

      }
    }
    handleFail(){
      AppActions.disableNotificationModal()

      this.setState({hasPermission: false})
    }
    handleSuccess(){
      this.setState({hasPermission: true})

    }

    _handleAppStateChange(currentAppState) {
      if(currentAppState == 'active'){
        PushNotificationIOS.checkPermissions( (permissions) => {
          const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
            acc = acc + permissions[el];
            return acc
          },0);

          // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
          this.setState({ hasPermission: (permResult > 0), failedState: false });
          AppActions.disableNotificationModal()

        })
      }
    }

    render(){
      const {relevantUser} = this.props;
      const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};
      const featuredPartner = featuredUser.relationship_status === 'couple' ? relevantUser.partner : {};
      const displayName = (`${featuredUser.firstname} ${featuredPartner.firstname || ''}`).trim();
      const featuredImage = (relevantUser && relevantUser.image_url) || (featuredUser && featuredUser.image_url) || null;

      return  (
        <View>
          <ScrollView
            style={[{padding:0,width:DeviceWidth,height:DeviceHeight,backgroundColor: 'transparent',paddingTop:0,flex:1,position:'absolute'}]}
            contentContainerStyle={{justifyContent:'center',alignItems:'center',flexDirection:'column',flex:1}}
          >
            <View style={{width:160,height:160,marginVertical:30}}>
              <Image style={[{width:160,height:160,borderRadius:80}]} source={
                  this.state.failedState ? {uri: 'assets/iconModalDenied@3x.png'} :
                  featuredImage ? {uri: featuredImage} : {uri:'assets/placeholderUser@3x.png'}
                }
                defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
              />
              <View   style={{width:32,height:32,borderRadius:16,overflow:'hidden',backgroundColor:colors.mandy,position:'absolute',top:6,right:6,justifyContent:'center',alignItems:'center'}}>
                <Text style={[{
                    fontSize:20,
                    marginLeft:2,
                    marginTop:-2,
                    width:32,
                    fontFamily:'Montserrat-Bold',
                    textAlign:'center',
                    color:'#fff',
                  }]}>1</Text>

              </View>
            </View>
            <View style={[{width:DeviceWidth, paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

              <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>{
                    this.state.failedState ? failedTitle : `GET NOTIFIED`
                  }
              </Text>

              <View style={{flexDirection:'column' }} >
                {featuredImage &&
                <Text style={[styles.rowtext,styles.bigtext,{ fontSize:22, marginVertical:10, color:'#fff', }]}
                  >Great! You’ve liked {displayName ? displayName : "them" }.</Text>
                    }
                    <Text style={[styles.rowtext,styles.bigtext,{
                        fontSize:22,
                        marginVertical:10,
                        color:'#fff',
                        marginBottom:15,
                        flexDirection:'column'
                      }]}>
                      {featuredImage ? `Would you like to be notified \nwhen they like you back?` : ` Would you like to be notified of new matches and messages?`}
                    </Text>
                  </View>
                </View>

                  <View>
                    <TouchableHighlight
                      style={{backgroundColor:'transparent',width:DeviceWidth-MagicNumbers.screenPadding*2,borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:0,marginTop:20,marginBottom:15}}
                      onPress={this.handleTapYes.bind(this)}>
                      <View style={{paddingVertical:20,paddingHorizontal:10,alignSelf:'stretch'}} >
                        <Text style={[styles.modalButtonText,{fontFamily:'Montserrat-Bold'}]}>
                          {
                            this.state.failedState ? 'GO TO SETTINGS' : `YES, ALERT ME!`

                          }
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style={{marginBottom:20}}>
                    <TouchableOpacity onPress={this.cancel.bind(this)}>
                      <View>
                        <Text style={[styles.nothankstext,{color:colors.warmGreyTwo,fontFamily:'Omnes-Regular'}]}>
                          No thanks, ask me later
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
              </ScrollView>
            </View>

          )
  }

}

class NewNotificationPermissions extends Component{
  render(){
    const storeFetcher = function(props){
      return {
        store: PotentialsStore,
        value: PotentialsStore.getMeta()
      }
    }

    return (
      <AltContainer store={storeFetcher}>
        <NewNotificationPermissionsInside {...this.props} close={this.props.close} />
      </AltContainer>
    )
  }
}


export default NewNotificationPermissions
