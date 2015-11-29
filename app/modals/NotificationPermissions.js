/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  Settings,
  View,
  AppStateIOS,
  PropTypes,
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  PushNotificationIOS,
  TouchableOpacity
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import UrlHandler from 'react-native-url-handler'
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'
import NotificationActions from '../flux/actions/NotificationActions'

const failedTitle = `ALERTS DISABLED`,
      failedSubtitle = `Notification permissions have been disabled. You can enable them in Settings`,
      buttonText = `YES, ALERT ME`;

class NotificationPermissions extends React.Component{
  static propTypes = {
    relevantUser: PropTypes.object //user
  }

  static defaultProps = {
    buttonText: 'YES',
    relevantUser: {
      image_url: null,
      firstname: 'This user'
    }
  }

  constructor(props){
      super()

      this.state = {
        failedState: false,
        permissions: null,
        hasPermission: null
      }
    }
    componentWillMount(){
      this.checkPermission()
    }

    checkPermission(){
      PushNotificationIOS.checkPermissions((permissions) => {
        const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
          acc = acc + permissions[el];
          return acc
        },0);
        this.setState({permissions, hasPermission: permResult > 0})
      })
    }
    componentDidUpdate(prevProps,prevState){
      if(!prevState.hasPermission && this.state.hasPermission ){
        this.props.navigator.pop()


      }
    }
    cancel(){
      this.props.navigator.pop()
    }
    handleTapYes(){
      if(this.state.failedState){
        UrlHandler.openUrl(UrlHandler.settingsUrl)

      }else{
        NotificationActions.requestNotificationsPermission()
        this.handleSuccess()
      }
    }
    handleFail(){
      this.setState({hasPermission: false})
      // AppActions.denyPermission(CameraKey)
    }
    handleSuccess(){
      this.setState({hasPermission: true})

    }
    componentDidMount() {
      AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
    }
    componentWillUnmount() {
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange(currentAppState) {
      if(currentAppState == 'active'){
        PushNotificationIOS.checkPermissions( (permission) => {
          const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
            acc = acc + permissions[el];
            return acc
          },0);

          this.setState({ hasPermission: (permResult > 0), failedState: false });
          AppStateIOS.removeEventListener('change', this._handleAppStateChange);
        })
      }
    }

    render(){
      const { relevantUser } = this.props
      return  (
        <PurpleModal>
          <View style={[styles.col,styles.fullWidth,{justifyContent:'space-between'}]}>
            <Image
              style={[{width:150,height:150,borderRadius:75,marginVertical:20}]}
              source={
                this.state.failedState ?
                  require('../../newimg/iconModalDenied.png') :
                  {uri: relevantUser.image_url}
                }
                defaultSource={{uri: '../../newimg/placeholderUser.png'}}

            />
            <View style={styles.insidemodalwrapper}>
              <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10
               }]}>  {
                this.state.failedState ? failedTitle : `GET NOTIFIED`
                }
              </Text>

              <Text
                style={[styles.rowtext,styles.bigtext,{
                  fontSize:20,
                  marginVertical:10,
                  color: colors.shuttleGray,
                  marginHorizontal:-5,
                  marginBottom:15
              }]}>
               {`Great! You’ve liked ${this.props.relevantUser.firstname}. Would you like to be notified when they like you back?`}
              </Text>
              <View>
                <TouchableHighlight
                  underlayColor={colors.darkGreenBlue}
                  style={styles.modalButtonWrap}
                  onPress={this.handleTapYes.bind(this)}>
                  <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>{
                    this.state.failedState ? 'GO TO SETTINGS' : `YES, ALERT ME`

                  }</Text>
                  </View>
                </TouchableHighlight>
              </View>

            <View >
              <TouchableOpacity onPress={this.cancel.bind(this)}>
                <View>
                  <Text style={styles.nothankstext}>no thanks</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </PurpleModal>
    )
  }

}



export default NotificationPermissions

