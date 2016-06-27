import React from "react";
import {Settings, Navigator, View, NativeModules} from "react-native";
import LocationPermissions from './modals/LocationPermission'
import NotificationPermissions from './modals/NotificationPermissions'
const {OSPermissions,RNHotlineController} = NativeModules
import Analytics from './utils/Analytics'
import SETTINGS_CONSTANTS from './utils/SettingsConstants'
import AppActions from './flux/actions/AppActions'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
const {HAS_SEEN_NOTIFICATION_REQUEST,LAST_ASKED_LOCATION_PERMISSION} = SETTINGS_CONSTANTS

 class TaskManager extends React.Component{
  constructor(props){
    super()

    this.state = {

    }
  }
  componentDidMount(){
    this.checkRunOnceSettings();

    const {id, firstname, phone, relationship_status, gender, image_url,  thumb_url, partner_id} = this.props.user;
    RNHotlineController.setUser(`${id}`, firstname, phone, relationship_status, gender, image_url, thumb_url, `${partner_id}` )
  }
  componentWillUnmount(){
    this.clearTimeout();
  }
  checkRunOnceSettings(){
    this.setTimeout(()=>{
      this.checkNotificationsSetting()

      this.checkLocationSetting()
    },2000);
  }

  checkNotificationsSetting(){
    OSPermissions.canUseNotifications((hasPermission)=>{

      if(parseInt(hasPermission) > 2){
        const hasSeenNotificationRequest = Settings.get(HAS_SEEN_NOTIFICATION_REQUEST);
        NotificationActions.requestNotificationsPermission()
        if(!hasSeenNotificationRequest && this.props.triggers.relevantUser){
          // this.showNotificationRequest(this.props.triggers.relevantUser)

        }
      }
    })
  }
  checkLocationSetting(){
    const hasSeenLocationRequest = Settings.get(LAST_ASKED_LOCATION_PERMISSION);

    OSPermissions.canUseLocation((hasPermission)=>{
console.log(hasPermission);
      if(parseInt(hasPermission) <= 2){
        // pop location modal

        // this.props.navigator.push({
        //   component: LocationPermissions,
        //   name:'Location Permission Modal',
        //   title:'Location Permission Modal',
        //   passProps:{
        //     x: 2,
        //     title:'Prioritze Local',
        //     user:this.props.user,
        //     failedTitle:'Location',
        //     failCallback: ()=>{ this.props.navigator.pop() },
        //     hideModal: ()=>{ this.props.navigator.pop() },
        //     closeModal: ()=>{ this.props.navigator.pop() }
        //
        //   }
        // })

        AppActions.showInModal({
          component: LocationPermissions,
            name:'Location Permission Modal',
            title:'Location Permission Modal',
            passProps:{
              title:'Prioritze Local',
              user:this.props.user,
              failedTitle:'Location',
              // failCallback: ()=>{ this.props.close() },
              // hideModal: ()=>{ this.props.close() },
              // closeModal: ()=>{ this.props.close() }

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

reactMixin(TaskManager.prototype, TimerMixin);
export default TaskManager
