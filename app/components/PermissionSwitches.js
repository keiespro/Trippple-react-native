/* @flow */


import React from "react";

import {StyleSheet, Text, View, SwitchIOS, Settings, PixelRatio, PushNotificationIOS, NativeModules, AsyncStorage, Dimensions} from "react-native";

import NotificationActions from '../flux/actions/NotificationActions'
import colors from '../utils/colors'
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../DeviceConfig'
import CheckPermissions from '../modals/CheckPermissions'
import NotificationPermissions from '../modals/NotificationPermissions'
import styles from './settingsStyles'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import Analytics from '../utils/Analytics'
const {OSPermissions} = NativeModules

import {
  HAS_SEEN_NOTIFICATION_REQUEST,
  LAST_ASKED_NOTIFICATION_PERMISSION,
  NOTIFICATION_SETTING,
  LEGACY_NOTIFICATION_SETTING,
  LOCATION_SETTING,
  LEGACY_LOCATION_SETTING
} from '../utils/SettingsConstants'

class PermissionSwitches extends React.Component{
  constructor(props){
    super()

    this.state = {
      LocationSetting: false,
      NotificationSetting: false
    }
  }
  componentDidMount(){
      const LocationSetting = Settings.get(LOCATION_SETTING) || Settings.get(LEGACY_LOCATION_SETTING) || null;
      const NotificationSetting = Settings.get(NOTIFICATION_SETTING) || Settings.get(LEGACY_NOTIFICATION_SETTING) || null;

      OSPermissions.canUseNotifications(OSNotifications => {
        OSPermissions.canUseLocation(OSLocation => {
          this.setState({
            LocationSetting: OSLocation > 2 || JSON.parse(LocationSetting) ? true : false,
            NotificationSetting: OSNotifications > 2 || JSON.parse(NotificationSetting) ? true : false,
            OSNotifications,
            OSLocation
          })
        })
      })

  }
  toggleLocation(){
    const {OSLocation} = this.state;

    Analytics.event('Interaction',{
      name: `Toggle location permission`,
      type: 'tap',
      value: parseInt(OSLocation)
    })

    if(!this.state.LocationSetting && !OSLocation){

      this.props.navigator.push({
        component:CheckPermissions,
        name:'LocationPermissionModal',
        passProps:{
          title:'PRIORITIZE LOCAL',
          subtitle:'Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          hideModal: () => {this.props.navigator.pop()},
          failCallback: (val)=>{
            this.setState({LocationSetting:false})
          },
          successCallback: (coords)=>{
            this.setState({LocationSetting:true})
            Settings.set({LocationSetting: true })

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
      })
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
          this.props.navigator.push({
            component:NotificationPermissions,
            passProps:{
              failCallback: (val)=>{
                this.props.navigator.pop();
                this.setState({ NotificationSetting: val })
              },
              successCallback: (val)=>{
                this.setState({ NotificationSetting: true })
              }
            }
          })
        }else{
          const newValue = !this.state.NotificationSetting;
          this.setState({ NotificationSetting: newValue });
          Settings.set({ [NOTIFICATION_SETTING]: newValue})
          NotificationActions.requestNotificationsPermission()
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
