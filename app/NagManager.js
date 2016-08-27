import { Settings, NativeModules, View } from 'react-native';
import React from 'react';

import LocationPermissions from './components/modals/LocationPermission'
import NotificationPermissions from './components/modals/NewNotificationPermissions'
const {OSPermissions,RNHotlineController} = NativeModules
import Analytics from './utils/Analytics'
import SETTINGS_CONSTANTS from './utils/SettingsConstants'
import ActionMan from  './actions/';
import OnboardModal from './components/modals/OnboardModal'
import { connect } from 'react-redux';
import PushNotification from 'react-native-push-notification'

import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'


class NagManager extends React.Component{

  componentWillReceiveProps(nProps){

    // relationship_status modal
    if(!this.props.loggedIn && nProps.loggedIn && !nProps.user.relationship_status && !this.props.user.relationship_status ){
      nProps.dispatch(ActionMan.showInModal({
        component: OnboardModal,
        passProps:{
          title:'Onboard',
          dispatch: nProps.dispatch,
          navigator:nProps.navigator,
          navigation:nProps.navigation,
          user:nProps.user,
        }
      }))
    }

    // location permission modal
    if(!this.props.nag.askedLocation && !nProps.nag.askedLocation && nProps.isNewUser){
      this.setTimeout(()=>{
        this.locationModal();
        this.props.dispatch({type:'ASKED_LOCATION',payload:true})
      },2000);
    }

    if(!nProps.nag.askedNotification && nProps.hasLiked && !this.props.hasLiked){
      PushNotification.checkPermissions((perm) =>{
        if(!perm.alert){
          this.setTimeout(()=>{
            this.notificationModal();
            this.props.dispatch({type:'ASKED_NOTIFICATION',payload:true})
          },2000);
        }
      })
    }


  }

  checkNotificationsSetting(){
    OSPermissions.canUseNotifications((hasPermission)=>{
      console.log('hasPermission notifications',parseInt(hasPermission))

      if(parseInt(hasPermission) > 2){


      }else{

      }
    })
  }

  notificationModal(){

    this.props.dispatch(ActionMan.showInModal({
      component: NotificationPermissions,
      passProps:{
        title:'N',
        user:this.props.user,
        cancel: ()=>{ this.props.close() }
      }
    }))

  }

  locationModal(){

    this.props.dispatch(ActionMan.showInModal({
      component: LocationPermissions,
      passProps:{
        title:'Prioritze Local',
        user:this.props.user,
        failedTitle:'Location',
        cancel: ()=>{ this.props.close() }
      }
    }))

  }

  checkLocationSetting(){
    const hasSeenLocationRequest = Settings.get(LAST_ASKED_LOCATION_PERMISSION);

    OSPermissions.canUseLocation((hasPermission)=>{
      if(parseInt(hasPermission) <= 2 || hasSeenLocationRequest){
        this.locationModal()
      }else if(parseInt(hasPermission) > 2){
        __DEV__ && console.log('have location permission, getting current location');

        this.props.dispatch(ActionMan.getLocation())
      }
    })

  }

  render(){
    return <View/>
  }

}



reactMixin.onClass(NagManager, TimerMixin);

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    fbUser: state.fbUser,
    auth: state.auth,
    nag: state.nag,
    loggedIn: state.auth.api_key && state.auth.user_id,
    isNewUser: state.user.isNewUser,
    hasLiked: state.likes.likeCount > 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NagManager);
