import React, {Settings,Navigator,View,NativeModules} from 'react-native'
import LocationPermissions from './modals/CheckPermissions'
import NotificationPermissions from './modals/NotificationPermissions'
const {OSPermissions} = NativeModules


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
      console.log(parseInt(hasPermission));
      if(hasPermission){
        const hasSeenNotificationRequest = Settings.get('HasSeenNotificationRequest');
        console.log(hasSeenNotificationRequest);
        if(!hasSeenNotificationRequest){

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
  }
  showNotificationRequest(relevantUser){
    console.log(this.props);

    this.props.navigator.push({
      component: NotificationPermissions,
      passProps:{
        relevantUser,
        successCallback:()=>{
          this.setHasSeenNotificationRequest()
        },
        failCallback:()=>{
          this.setHasSeenNotificationRequest()
        }
      },
    })
  }

  setHasSeenNotificationRequest(){
    Settings.set({HasSeenNotificationRequest:true})
  }

  render(){
    return (<View/>)
  }
}
