import React from 'react'
import reactMixin from 'react-mixin'
import { Text, View, SwitchIOS, Settings, PushNotificationIOS, Platform, NativeModules, Dimensions } from 'react-native'
import ActionMan from '../../actions/'
import Analytics from '../../utils/Analytics'
import { MagicNumbers } from '../../utils/DeviceConfig'
import {
  HAS_SEEN_NOTIFICATION_REQUEST,
  LAST_ASKED_NOTIFICATION_PERMISSION,
  NOTIFICATION_SETTING,
  LEGACY_NOTIFICATION_SETTING,
  LOCATION_SETTING,
  LEGACY_LOCATION_SETTING
} from '../../utils/SettingsConstants'
import colors from '../../utils/colors'
import LocationPermissions from '../modals/LocationPermission'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import styles from '../screens/settings/settingsStyles'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {OSPermissions} = NativeModules
const iOS = Platform.OS == 'ios';

function parseNotificationPermissions(nPermissions){
    return Object.keys(nPermissions).reduce((acc,el,i) => {
        acc = acc + nPermissions[el];
        return acc
    },0);
}

class PermissionSwitches extends React.Component{
    constructor(props){
        super()
        this.state = { }
    }
    componentDidMount(){

        PushNotificationIOS.checkPermissions( permissions => {
            const permResult = parseNotificationPermissions(permissions);
            this.setState({
                NotificationSetting: permResult,
            })

            OSPermissions.canUseLocation(OSLocation => {
                this.setState({
                    LocationSetting: parseInt(OSLocation) > 2,
                })
            })
        })
    }
    toggleLocation(){
        const {LocationSetting} = this.state;

        Analytics.event('Interaction',{
            name: `Toggle location permission`,
            type: 'tap',
        })

        if(!LocationSetting ){

            OSPermissions.canUseLocation(OSLocation => {
                const perm = parseInt(OSLocation) > 2;

                if(perm){
                    this.setState({LocationSetting:true})
                }else{
                    this.props.dispatch(ActionMan.showInModal({
                        component:'LocationPermission',
                        name:'LocationPermissionModal',
                        passProps:{
                            title:'PRIORITIZE LOCAL',
                            subtitle:'Should we prioritize the matches closest to you?',
                            failedTitle: 'LOCATION DISABLED',
                            failCallback: val => {
                                this.setState({LocationSetting:false})
                                this.props.dispatch(ActionMan.killModal())
                            },
                            successCallback: (coords)=>{
                                this.setState({LocationSetting:true})
                                this.props.dispatch(ActionMan.killModal())
                            },
                            failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
                            headerImageSource:'iconDeck',
                        }
                    })
                )}
            })
        }else{
            const newValue = !this.state.LocationSetting;
            this.setState({ LocationSetting: newValue })
        }
    }
    toggleNotification(){
        const {NotificationSetting} = this.state
        if(!NotificationSetting && iOS){

            PushNotificationIOS.checkPermissions( permissions => {
                const permResult = parseNotificationPermissions(permissions);

                if(!permResult){
                    this.props.dispatch(ActionMan.showInModal({
                        component:'NotificationPermissions',
                        passProps:{
                            failCallback: (val)=>{
                                this.props.dispatch(ActionMan.killModal())
                                this.setState({ NotificationSetting: false})
                            },
                            successCallback: val => {
                                this.props.dispatch(ActionMan.killModal())
                                this.setState({ NotificationSetting: true})
                            }
                        }
                    }))
                }else{
                    const newValue = !this.state.NotificationSetting;
                    this.setState({ NotificationSetting: newValue});
          // this.props.dispatch(ActionMan.requestNotificationsPermission())
                }
            })

        }else{
            this.setState({ NotificationSetting: false,OSNotifications:false })
        }
    }

    render(){
        return (
            <View style={{paddingBottom:30}}>
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
                            value={this.state.NotificationSetting ? true : false}
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
