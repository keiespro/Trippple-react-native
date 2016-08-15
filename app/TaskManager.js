import React from "react";
import {Settings, Navigator, View, NativeModules} from "react-native";
import LocationPermissions from './modals/LocationPermission'
import NotificationPermissions from './modals/NewNotificationPermissions'
const {OSPermissions,RNHotlineController} = NativeModules
import Analytics from './utils/Analytics'
import SETTINGS_CONSTANTS from './utils/SettingsConstants'
import AppActions from './flux/actions/AppActions'
import UserActions from './flux/actions/UserActions'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
const {HAS_SEEN_NOTIFICATION_REQUEST,LAST_ASKED_LOCATION_PERMISSION} = SETTINGS_CONSTANTS


//TODO: the correct thing seems to have DID_DENY_LOCATION to avoid the request entirely if they denied it outright. currently it pops up every single time you open the app (doh)


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
      console.log('hasPermission notifications',hasPermission)

      if(parseInt(hasPermission) > 2){
        const hasSeenNotificationRequest = Settings.get(HAS_SEEN_NOTIFICATION_REQUEST);
        // NotificationActions.requestNotificationsPermission()
//         if(!hasSeenNotificationRequest && this.props.triggers.relevantUser){
//           this.showNotificationRequest(this.props.triggers.relevantUser)
//         }
        NotificationActions.requestNotificationsPermission()
      }else{
        // AppActions.showInModal({
        //   component: NotificationPermissions,
        //   passProps:{}
        // })
      }
    })
  }
  checkLocationSetting(){
    const hasSeenLocationRequest = Settings.get(LAST_ASKED_LOCATION_PERMISSION);

    OSPermissions.canUseLocation((hasPermission)=>{
       if(parseInt(hasPermission) <= 2 || hasSeenLocationRequest){

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



      }else if(parseInt(hasPermission) > 2){
        __DEV__ && console.log('have location permission, getting current location');
        const success = (geo => {
          __DEV__ && console.log(...geo.coords);
          UserActions.updateUser(geo.coords);
        })
        const fail = (error => console.log(error));
        const options = {enableHighAccuracy: false, maximumAge: 10};

        navigator.geolocation.getCurrentPosition(success, fail, options)
      }
    })

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
