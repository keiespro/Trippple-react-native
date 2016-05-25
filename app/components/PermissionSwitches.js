/* @flow */


import React from "react";

import {StyleSheet, Text, View, SwitchIOS,Settings, PixelRatio, PushNotificationIOS, NativeModules, AsyncStorage, Dimensions} from "react-native";

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

var {OSPermissions} = NativeModules


class PermissionSwitches extends React.Component{
  constructor(props){
    super()

    this.state = {
      LocationSetting: false,
      NotificationSetting: false
    }
  }
  componentWillMount(){
    // AsyncStorage.multiGet(['LocationSetting','NotificationSetting'])
    // .then((settings) => {
      // console.log(settings);
      const LocationSetting = Settings.get('LocationSetting')// settings[0][1] ? JSON.parse(settings[0][1]) : false;
      const NotificationSetting = Settings.get('NotificationSetting')//settings[1][1] ? JSON.parse(settings[1][1]) : false;

      this.setState({
        LocationSetting: JSON.parse(OSPermissions.location) > 2 && LocationSetting ? true : false,
        NotificationSetting: OSPermissions.notifications && NotificationSetting ? true : false,
      })
    // }).catch((err) => {
    //
    // })
  }
  toggleLocation(){
    Analytics.event('Interaction',{
      name: `Toggle location permission`,
      type: 'tap',
      value: JSON.parse(OSPermissions.location)
    })

    if(!OSPermissions.location || OSPermissions.location && !JSON.parse(OSPermissions.location)){

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
              value: coords
            })
          },
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          failedState: (JSON.parse(OSPermissions.location) < 3 ? true : false),
          headerImageSource:'iconDeck',
          permissionKey:'location',
          renderNextMethod: 'pop',
          renderMethod:'push',
          renderPrevMethod:'pop',
        }
      })
    }else{
      const newValue = !this.state.LocationSetting;
      Settings.set({LocationSetting: newValue })
      this.setState({ LocationSetting: newValue })
    }
  }
  toggleNotification(){
    if(this.state.NotificationSetting == false){

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
          Settings.set({NotificationSetting:newValue})
          NotificationActions.requestNotificationsPermission()
        }
      })

    }else{
      this.setState({ NotificationSetting: false })
    }
  }

  componentDidUpdate(pProps,pState){
    if(this.state.nearMeToggled != pState.nearMeToggled && !pState.nearMeToggled){
      OSPermissions.canUseLocation( (locPerm) => {
        if(locPerm > 2){
          this.setState({nearMeToggled:true})
        }else{
          this.setState({nearMeToggled:false})
        }
      })
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
