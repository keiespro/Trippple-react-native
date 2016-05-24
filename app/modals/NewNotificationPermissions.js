/* @flow */

import React from "react";

import {Component, PropTypes} from "react";
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
import {} from 'react-native'



const failedTitle = `ALERTS DISABLED`,
      failedSubtitle = `Notification permissions have been disabled. You can enable them in Settings`,
      buttonText = `YES, ALERT ME`;

class NotificationPermissions extends React.Component{
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
      console.log(props.relevantUser)
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
      Settings.set({'co.trippple.HasSeenNotificationRequest': true,'co.trippple.LastNotificationsPermissionRequestTimestamp':Date.now()})

    }

    checkPermission(){
      PushNotificationIOS.checkPermissions((permissions) => {
        const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
          acc = acc + permissions[el];
          return acc
        },0);

        this.setState({permissions, hasPermission: permResult > 0})

      })
    }
    componentDidUpdate(prevProps,prevState){
      if(!prevState.hasPermission && this.state.hasPermission ){
        // this.props.failCallback(true)

      }
    }
    cancel(){
      this.props.close()
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
            PushNotificationIOS.addEventListener('register',(token) => {
              __DEV__ && console.warn('APN -> ',token);
                NotificationActions.receiveAPNtoken(token)
                AppActions.disableNotificationModal()

                this.setState({permissions, hasPermission: true})
                // this.props.successCallback && this.props.successCallback();
                this.props.close()
            })
            PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})


          }else{

            AppActions.disableNotificationModal()

            this.setState({permissions, hasPermission: true})
            // this.props.successCallback && this.props.successCallback();
            this.props.close()

          }

        })

      }
    }
    handleFail(){
      this.setState({hasPermission: false})
    }
    handleSuccess(){
      this.setState({hasPermission: true})

    }
    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }
    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange(currentAppState) {
      if(currentAppState == 'active'){
        PushNotificationIOS.checkPermissions( (permissions) => {
          const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
            acc = acc + permissions[el];
            return acc
          },0);

          this.setState({ hasPermission: (permResult > 0), failedState: false });
          AppState.removeEventListener('change', this._handleAppStateChange);
        })
      }
    }

    render(){
      const {relevantUser}  = this.props;
      console.log(relevantUser);
      const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};

      return  (
          <View>
            <BlurView blurType="dark" style={[{position:'absolute',top:0,width:DeviceWidth,height:DeviceHeight,justifyContent:'center',alignItems:'center',flexDirection:'column'}]}/>
          <ScrollView style={[{padding:0,width:DeviceWidth,height:DeviceHeight,backgroundColor: 'transparent',paddingTop:50,flex:1,position:'relative'}]} contentContainerStyle={{justifyContent:'center',alignItems:'center',}}>

          <View style={{width:160,height:160,marginVertical:30}}>
          <Image
              style={[{width:160,height:160,borderRadius:80}]}
              source={
                this.state.failedState ? {uri: 'assets/iconModalDenied@3x.png'} :
                  featuredUser && featuredUser.image_url ? {uri: featuredUser.thumb_url} : {uri:'assets/placeholderUser@3x.png'}
              }
              defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          <View style={{width:32,height:32,borderRadius:16,overflow:'hidden',backgroundColor:colors.mandy,position:'absolute',top:6,right:6,justifyContent:'center',alignItems:'center'}}>
                        <Text
                          style={[{
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
          <View style={[{width:DeviceWidth,
              paddingHorizontal:MagicNumbers.screenPadding/2 }]}>
              <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10
               }]}>{
                this.state.failedState ? failedTitle : `GET NOTIFIED`
                }
              </Text>

              <View style={{flexDirection:'column' }} >
               {featuredUser && featuredUser.image_url && <Text style={[styles.rowtext,styles.bigtext,{
                   fontSize:22,
                   marginVertical:10,
                   color:'#fff',
               }]}>Great! You’ve liked {featuredUser && featuredUser.firstname && featuredUser.firstname.length ? featuredUser.firstname : "them" }.</Text> }
               <Text   style={[styles.rowtext,styles.bigtext,{
                   fontSize:22,
                   marginVertical:10,
                   color:'#fff',
                   marginBottom:15,
                   flexDirection:'column'
               }]}>{featuredUser && featuredUser.image_url ? `Would you like to be notified \nwhen they like you back?` : ` Would you like to be notified of new matches and messages?`}</Text>
             </View>
              <View>
                <TouchableHighlight
                  style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:20,marginBottom:15}}
                  onPress={this.handleTapYes.bind(this)}>
                  <View style={{paddingVertical:20}} >
                  <Text style={[styles.modalButtonText,{fontFamily:'Montserrat-Bold'}]}>{
                    this.state.failedState ? 'GO TO SETTINGS' : `YES, ALERT ME!`

                  }</Text>
                  </View>
                </TouchableHighlight>
              </View>

            <View style={{marginBottom:20}}>
              <TouchableOpacity onPress={this.cancel.bind(this)}>
                <View>
                  <Text style={[styles.nothankstext,{color:colors.warmGreyTwo,fontFamily:'Omnes-Regular'}]}>No thanks, ask me later</Text>
                </View>
              </TouchableOpacity>
            </View>
    </View>
    </ScrollView>
    </View>

    )
  }

}



export default NotificationPermissions
