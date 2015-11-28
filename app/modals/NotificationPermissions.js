/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  Settings,
  CameraRoll,
  View,
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
      buttonText = `YES, ALERT ME`,
      subtitle = `Great! You’ve liked {USERNAME}. Would you like to be notified when {THEY} like you back?`

 export default class NotificationPermissions extends React.Component{
    constructor(props){
      super()

      this.state = {
        permissions: null,
        hasPermission: null
      }
    }
    componentWillMount(){
      this.recheck()
    }

    recheck(){
      PushNotificationIOS.checkPermissions((permissions) => {
        this.setState({permissions, hasPermission: permissions})
      })
    }

    render(){
      return <InsideNotificationModal
              navigator={this.props.navigator}
              recheck={this.recheck.bind(this)}
              permission={this.state.hasPermission}
              relevantUser={this.props.relevantUser}
            />
    }

 }




 class InsideNotificationModal extends React.Component{

  static propTypes = {
    relevantUser: PropTypes.object //user
  };

  static defaultProps = {
    buttonText: 'YES'
  }

  constructor(props) {
    super();
    this.state = {
      hasPermission: props.hasPermission,
      failedState: (parseInt(props.hasPermission)  && parseInt(props.hasPermission) < 2)
    }
  }

  componentWillMount(){


  }

  componentDidMount(){
    console.log('LOC MODAL')
    if(this.state.hasPermission){
      // this.props.failCallback ? this.props.failCallback() : this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )
    }else{

    }

  }
  componentDidUpdate(prevProps,prevState){
    if(this.state.hasPermission && !prevState.hasPermission){
      // should i maybe  auto do this ?
      // this.props.navigator.pop()

    }else if(this.state.failedState){

    }
  }

  requestPermission(){
        NotificationActions.requestNotificationsPermission(relevantUser)

    this.props.navigator.pop();
  }

  cancel(){
    this.props.navigator.pop()
  }
  openSettings(){

    // set an actual app state listener for when user comes back after settings

      UrlHandler.openUrl(UrlHandler.settingsUrl)
  }

  handleTapYes(){
    if(this.state.failedState){
      this.openSettings()
    }else{
      if(!this.state.hasPermission){
        this.requestPermission()
      }else{
        this.handleSuccess()

      }
    }



  }

  handleFail(){
    this.setState({hasPermission: false})
    // AppActions.denyPermission(this.props.permissionKey)
    this.props.navigator.pop()

  }

  handleSuccess(geo){
    this.setState({hasPermission: true})
    // AppActions.grantPermission(this.props.permissionKey)
    this.cancel();
  }

  handleContinue(){
    this.cancel();
  }

  render(){
    return this.renderModal()
  }


  renderButton(){
    return (
      <View style={styles.modalButtonWrap} >
        <TouchableHighlight
          underlayColor={colors.mediumPurple}
          style={styles.modalButtonWrap}
          onPress={this.handleTapYes.bind(this)}>
          <View style={[styles.modalButton]} >
            <Text style={styles.modalButtonText}>{this.state.failedState ? 'GO TO SETTINGS' : buttonText}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderModal(){
    console.log('RENDER MODAL')
    return (
      <View style={{position:'absolute',top:0}}>
      <PurpleModal>
        <View style={[styles.col,{paddingVertical:10}]}>
          <Image
            resizeMode={Image.resizeMode.fill}

            style={[{width:150,height:150,borderRadius:0,marginVertical:20}]}
            source={this.props.relevantUser}/>

          <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>
              {this.state.failedState ? failedTitle : `GET NOTIFIED`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:18,marginVertical:10,color: colors.lavender,marginHorizontal:10
              }]}>{this.state.failedState ? this.props.failedSubtitle : subtitle || ''}
            </Text>

            {this.renderButton()}
          </View>

          <View >
            <TouchableOpacity
              onPress={this.cancel.bind(this)}>
              <View style={[styles.cancelButton,{  backgroundColor:'transparent'}]} >
                <Text style={[styles.nothankstext,{  backgroundColor:'transparent'}]}>no thanks</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </PurpleModal>
    </View>

    )
  }


}
