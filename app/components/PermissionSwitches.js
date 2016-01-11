/* @flow */


import React, {
  StyleSheet,
  Text,
  View,
  SwitchIOS,
  PixelRatio,
  PushNotificationIOS,
  NativeModules,
  AsyncStorage,
  Dimensions
} from  'react-native'

import NotificationActions from '../flux/actions/NotificationActions'
import colors from '../utils/colors'
import reactMixin from 'react-mixin'
import {MagicNumbers} from '../DeviceConfig'
import CheckPermissions from '../modals/CheckPermissions'
import NotificationPermissions from '../modals/NotificationPermissions'
import styles from './settingsStyles'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var {OSPermissions} = NativeModules


class PermissionSwitches extends React.Component{
  constructor(props){
    super()

    this.state = {
      locationSetting: false,
      notificationSetting: false
    }
  }
  componentWillMount(){
    AsyncStorage.multiGet(['locationSetting','notificationSetting'])
    .then((settings) => {
      const locationSetting = settings[0][1] ? JSON.parse(settings[0][1]) : false;
      const notificationSetting = settings[1][1] ? JSON.parse(settings[1][1]) : false;

      this.setState({
        locationSetting: parseInt(OSPermissions.location) > 2 && locationSetting ? true : false,
        notificationSetting: OSPermissions.notifications && notificationSetting ? true : false,
      })
    }).catch((err) => {

    })
  }
  toggleLocation(){
    if(!OSPermissions.location || OSPermissions.location && !parseInt(OSPermissions.location)){
      this.props.navigator.push({
        component:CheckPermissions,
        passProps:{
          title:'PRIORITIZE LOCAL',
          subtitle:'Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          failCallback: (val)=>{
            this.props.navigator.pop();
            this.setState({locationSetting:false})
          },
          successCallback: (coords)=>{
            this.props.navigator.pop();
            this.setState({locationSetting:true})
          },
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          failedState: (parseInt(OSPermissions.location) < 3 ? true : false),
          headerImageSource:'iconDeck',
          permissionKey:'location',
          renderNextMethod: 'pop',
          renderMethod:'push',
          renderPrevMethod:'pop',
        }
      })
    }else{
      const newValue = !this.state.locationSetting;
      AsyncStorage.setItem('locationSetting', newValue + '')
      this.setState({ locationSetting: newValue })
    }
  }
  toggleNotification(){
    if(this.state.notificationSetting == false){

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
                this.setState({ notificationSetting: val })
              },
              successCallback: (val)=>{
                this.setState({ notificationSetting: val })
              }

            }
          })
        }else{
          const newValue = !this.state.notificationSetting;
          this.setState({ notificationSetting: newValue });
          AsyncStorage.setItem('notificationSetting', newValue + '')
          NotificationActions.requestNotificationsPermission()
        }
      })

    }else{
      this.setState({ notificationSetting: false })
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
              value={this.state.locationSetting}
              onTintColor={colors.dark}
              thumbTintColor={this.state.locationSetting ? colors.mediumPurple : colors.shuttleGray}
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
              value={this.state.notificationSetting > 0 ? true : false}
              onTintColor={colors.dark}
              thumbTintColor={this.state.notificationSetting ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default PermissionSwitches
