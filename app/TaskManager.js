import React from "react";
import {Settings, Navigator, View, NativeModules} from "react-native";
import LocationPermissions from './modals/LocationPermission'
import NotificationPermissions from './modals/NotificationPermissions'
const {OSPermissions} = NativeModules
import Analytics from './utils/Analytics'
import SETTINGS_CONSTANTS from './utils/SettingsConstants'
import AppActions from './flux/actions/AppActions'

const {HAS_SEEN_NOTIFICATION_REQUEST,LAST_ASKED_LOCATION_PERMISSION} = SETTINGS_CONSTANTS

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
        const hasSeenNotificationRequest = Settings.get(HAS_SEEN_NOTIFICATION_REQUEST);

        if(!hasSeenNotificationRequest && this.props.triggers.relevantUser){
          this.showNotificationRequest(this.props.triggers.relevantUser)

        }
      }
    })
  }
  checkLocationSetting(){
    const hasSeenLocationRequest = Settings.get(LAST_ASKED_LOCATION_PERMISSION);
    console.log(hasSeenLocationRequest);
    OSPermissions.canUseLocation((hasPermission)=>{
      console.log(hasPermission);

      if(!parseInt(hasPermission)){
        // pop location modal

        this.props.navigator.push({
          component: LocationPermissions,
          name:'Location Permission Modal',
          title:'Location Permission Modal',
          passProps:{
            x: 2,
            title:'Prioritze Local',
            user:this.props.user,
            failedTitle:'Location',
            failCallback: ()=>{ this.props.navigator.pop() },
            hideModal: ()=>{ this.props.navigator.pop() }

          }
        })



      }
    })
    // const success = (geo) => {
    //         this.updateUser.defer(geo.coords);
    //         dispatch(geo.coords);
    //       },
    //       fail = (error) => { dispatch(error) },
    //       options = {enableHighAccuracy: false, maximumAge: 10};
    //
    // navigator.geolocation.getCurrentPosition(success, fail, options)

  }

  componentWillReceiveProps(nProps){
    if(nProps.triggers.relevantUser && !this.props.triggers.relevantUser && nProps.triggers.requestNotificationsPermission && !this.props.triggers.requestNotificationsPermission){
      // this.showNotificationRequest(nProps.triggers.relevantUser)
    }

    // this.showNotificationRequest(nProps.triggers.relevantUser)

  }
  showNotificationRequest(relevantUser){

    // AppActions.showNotificationModalWithLikedUser.defer(relevantUser)

          // .then(()=>this.setHasSeenNotificationRequest())
          // .catch((err)=>{console.log(err);})

  }

  setHasSeenNotificationRequest(u){
    Settings.set({
      [HAS_SEEN_NOTIFICATION_REQUEST]: u ? u : true
    })

    AppActions.disableNotificationModal()

  }

  render(){
    return (<View/>)
  }
}
