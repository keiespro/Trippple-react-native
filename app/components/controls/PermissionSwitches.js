import {
  Text,
  View,
  SwitchIOS,
  Settings,
  PushNotificationIOS,
  NativeModules,
  Dimensions,
} from 'react-native';
import React from "react";

import LocationPermissions from '../modals/LocationPermission';
import NotificationPermissions from '../modals/NewNotificationPermissions';
import styles from '../screens/settings/settingsStyles';
import colors from '../../utils/colors'
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../../utils/DeviceConfig'
import ActionMan from '../../actions/'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import Analytics from '../../utils/Analytics'
const {OSPermissions} = NativeModules


import {
  HAS_SEEN_NOTIFICATION_REQUEST,
  LAST_ASKED_NOTIFICATION_PERMISSION,
  NOTIFICATION_SETTING,
  LEGACY_NOTIFICATION_SETTING,
  LOCATION_SETTING,
  LEGACY_LOCATION_SETTING
} from '../../utils/SettingsConstants'

class PermissionSwitches extends React.Component{
  constructor(props){
    super()

    this.state = {
      LocationSetting: parseInt(OSPermissions.location) > 2,
      NotificationSetting: parseInt(OSPermissions.notifications) > 0
    }
  }
  componentDidMount(){
    const LocationSetting = Settings.get(LOCATION_SETTING) || Settings.get(LEGACY_LOCATION_SETTING) || null;
    const NotificationSetting = Settings.get(NOTIFICATION_SETTING) || Settings.get(LEGACY_NOTIFICATION_SETTING) || null;

    OSPermissions.canUseNotifications(OSNotifications => {
      OSPermissions.canUseLocation(OSLocation => {
        console.log(OSNotifications)

        this.setState({
          LocationSetting: parseInt(OSLocation) > 2,
          NotificationSetting: parseInt(OSNotifications) > 0,
          OSNotifications: parseInt(OSNotifications),
          OSLocation: parseInt(OSLocation)
        })
      })
    })

  }
  toggleLocation(){
    console.log(this.state);
    const {OSLocation} = this.state;

    Analytics.event('Interaction',{
      name: `Toggle location permission`,
      type: 'tap',
      value: parseInt(OSLocation)
    })

    if(!this.state.LocationSetting && !OSLocation){

      this.props.dispatch(ActionMan.showInModal({
        component:CheckPermissions,
        name:'LocationPermissionModal',
        passProps:{
          title:'PRIORITIZE LOCAL',
          subtitle:'Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          hideModal: () => { this.props.dispatch(ActionMan.killModal())},
          cancel: () => { this.props.dispatch(ActionMan.killModal())},
          failCallback: (val)=>{
            this.setState({LocationSetting:false})
            this.props.dispatch(ActionMan.killModal())
          },
          successCallback: (coords)=>{
            this.setState({LocationSetting:true})
            Settings.set({LocationSetting: true })
            this.props.dispatch(ActionMan.killModal())
            Analytics.extra('Permission', {
              name: `got location`,
              type: 'tap',
              value: coords+''
            })
          },
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          failedState: OSLocation < 3 ? true : false,
          headerImageSource:'iconDeck',
          permissionKey:'location',
          renderNextMethod: 'pop',
          renderMethod:'push',
          renderPrevMethod:'pop',
        }
      }))
    }else{
      const newValue = !this.state.LocationSetting;
      Settings.set({[LOCATION_SETTING]: newValue })
      this.setState({ LocationSetting: newValue })
    }
  }
  toggleNotification(){
    const {NotificationSetting, OSNotifications} = this.state
    if(this.state.NotificationSetting == false || !OSNotifications){

      PushNotificationIOS.checkPermissions( (permissions) => {
        const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
          acc = acc + permissions[el];
          return acc
        },0);

        if(!permResult){
          this.props.dispatch(ActionMan.showInModal({
            component:NotificationPermissions,
            passProps:{
              hideModal: () => { this.props.dispatch(ActionMan.killModal())},
              cancel: () => { this.props.dispatch(ActionMan.killModal())},
              failCallback: (val)=>{
                this.props.dispatch(ActionMan.killModal())
                this.setState({ NotificationSetting: val })
              },
              successCallback: (val)=>{
                this.props.dispatch(ActionMan.killModal())
                this.setState({ NotificationSetting: true })
              }
            }
          }))
        }else{
          const newValue = !this.state.NotificationSetting;
          this.setState({ NotificationSetting: newValue });
          Settings.set({ [NOTIFICATION_SETTING]: newValue})
          // this.props.dispatch(ActionMan.requestNotificationsPermission())
        }
      })

    }else{
      this.setState({ NotificationSetting: false })
    }
  }

  render(){
    return (
      <View>
        <View style={[styles.paddedSpace,{marginBottom:15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{`Location`}</Text>
          </View>
          <View style={[styles.insideSelectable,styles.formRow,{borderBottomWidth:0}]}>
            <Text style={{color: colors.white, fontSize:18}}>Prioritize Users Near Me</Text>
            <SwitchIOS
              onValueChange={this.toggleLocation.bind(this)}
              value={this.state.LocationSetting > 0 ? true : false}
              onTintColor={colors.dark}
              thumbTintColor={this.state.LocationSetting ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
        <View style={[styles.paddedSpace,{marginBottom:15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{`Notifications`}</Text>
          </View>
          <View style={[styles.insideSelectable,styles.formRow,{borderBottomWidth:0}]}>
            <Text style={{color:  colors.white, fontSize:18}}>Get notifications</Text>
            <SwitchIOS
              onValueChange={this.toggleNotification.bind(this)}
              value={this.state.NotificationSetting > 0 ? true : false}
              onTintColor={colors.dark}
              thumbTintColor={this.state.NotificationSetting ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default PermissionSwitches
