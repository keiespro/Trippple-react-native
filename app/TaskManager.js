import React from "react";
import {Settings, Navigator, View, NativeModules} from "react-native";
import LocationPermissions from './modals/CheckPermissions'
import NotificationPermissions from './modals/NotificationPermissions'
const {OSPermissions} = NativeModules

import AppActions from './flux/actions/AppActions'

export default class TaskManager extends React.Component{
  constructor(props){
    super()

    this.state = {

    }
  }
  componentDidMount(){
    this.checkRunOnceSettings();
  }
  checkRunOnceSettings(){
    this.checkNotificationsSetting()
    this.checkLocationSetting()
  }
  checkNotificationsSetting(){
    OSPermissions.canUseNotifications((hasPermission)=>{

      if(hasPermission){
        const hasSeenNotificationRequest = Settings.get('HasSeenNotificationRequest');

        if(!hasSeenNotificationRequest && this.props.triggers.relevantUser){
          this.showNotificationRequest(this.props.triggers.relevantUser)

        }
      }
    })
  }
  checkLocationSetting(){
    // const hasSeenLocationRequest = Settings.get('HasSeenLocationRequest');

  }
  componentWillReceiveProps(nProps){
    if(nProps.triggers.relevantUser && !this.props.triggers.relevantUser && nProps.triggers.requestNotificationsPermission && !this.props.triggers.requestNotificationsPermission){
      this.showNotificationRequest(nProps.triggers.relevantUser)
    }

    // this.showNotificationRequest(nProps.triggers.relevantUser)

  }
  showNotificationRequest(relevantUser){

    AppActions.showNotificationModalWithLikedUser.defer(relevantUser)
          // .then(()=>this.setHasSeenNotificationRequest())
          // .catch((err)=>{console.log(err);})

  }

  setHasSeenNotificationRequest(u){
    Settings.set({HasSeenNotificationRequest: u ? u : true})
    AppActions.disableNotificationModal()

  }

  render(){
    return (<View/>)
  }
}
