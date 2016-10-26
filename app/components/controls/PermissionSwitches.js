import React from 'react'
import reactMixin from 'react-mixin'
import { Text, View, Switch, Settings, PushNotificationIOS, Platform, NativeModules, Dimensions } from 'react-native'
import {connect} from 'react-redux'
// import {
//   HAS_SEEN_NOTIFICATION_REQUEST,
//   LAST_ASKED_NOTIFICATION_PERMISSION,
//   NOTIFICATION_SETTING,
//   LEGACY_NOTIFICATION_SETTING,
//   LOCATION_SETTING,
//   LEGACY_LOCATION_SETTING
// } from '../../utils/SettingsConstants'
import ActionMan from '../../actions/'
import Analytics from '../../utils/Analytics'

import colors from '../../utils/colors'
import styles from '../screens/settings/settingsStyles'

// const DeviceHeight = Dimensions.get('window').height
// const DeviceWidth = Dimensions.get('window').width
const iOS = Platform.OS == 'ios';

class PermissionSwitches extends React.Component{
  constructor(props){
    super()
    this.state = { }
  }
  componentDidMount(){
    // iOS && PushNotificationIOS.checkPermissions(permissions => {
    //   const permResult = parseNotificationPermissions(permissions);
    //   this.setState({
    //     NotificationSetting: permResult,
    //   })
    //
    //   OSPermissions.canUseLocation(OSLocation => {
    //     this.setState({
    //       LocationSetting: parseInt(OSLocation) > 2,
    //     })
    //   })
    // })
  }
  toggleLocation(){
    const {permissions} = this.props
    const {location} = permissions

    Analytics.event('Interaction', {
      name: 'Toggle location permission',
      type: 'tap',
    })

    if(!location){
      this.props.dispatch(ActionMan.showInModal({
        component: 'LocationPermissions',
        name: 'LocationPermissionModal',
        passProps: {
          title: 'PRIORITIZE LOCAL',
          subtitle: 'Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          headerImageSource: 'iconDeck',
        }
      }))
    }else{
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION'})


    }
  }
  toggleNotification(){
    const {permissions} = this.props
    const {notifications} = permissions

    if(iOS && notifications != 'true'){
      this.props.dispatch(ActionMan.showInModal({
        component: 'NotificationsPermissions',
        passProps: {

        }
      }))
    }else{
      this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS'})
    }
  }

  render(){
    const {permissions, switches} = this.props;
     const locationValue = permissions.location && switches.location ? true : false;
    const notificationsValue = permissions.notifications == 'true' && switches.notifications ? true : false;


    return (
      <View style={{paddingBottom: 30}}>
        <View style={[styles.paddedSpace, {marginBottom: 15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{'Location'}</Text>
          </View>
          <View style={[styles.insideSelectable, styles.formRow, {borderBottomWidth: 0}]}>
            <Text style={{color: colors.white, fontSize: 18}}>Prioritize Users Near Me</Text>
            <Switch
              onValueChange={this.toggleLocation.bind(this)}
              value={locationValue}
              onTintColor={colors.dark}
              thumbTintColor={locationValue ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
        <View style={[styles.paddedSpace, {marginBottom: 15}]}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>{'Notifications'}</Text>
          </View>
          <View style={[styles.insideSelectable, styles.formRow, {borderBottomWidth: 0}]}>
            <Text style={{color: colors.white, fontSize: 18}}>Get notifications</Text>
            <Switch
              onValueChange={this.toggleNotification.bind(this)}
              value={notificationsValue}
              onTintColor={colors.dark}
              thumbTintColor={notificationsValue ? colors.mediumPurple : colors.shuttleGray}
              tintColor={colors.dark}
            />
          </View>
        </View>
      </View>
        )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  permissions: state.permissions,
  switches: state.settings.permissionSwitches
})


const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(PermissionSwitches);
