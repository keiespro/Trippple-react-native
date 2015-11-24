/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  CameraRoll,
  View,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  NativeModules,
  PropTypes,
  AppStateIOS,
  PixelRatio
} from 'react-native'
import Camera from 'react-native-camera';
import CoupleCameraControl from '../controls/CoupleCameraControl'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {CameraManager,OSPermissions} = NativeModules
import UrlHandler from 'react-native-url-handler'

const CameraKey = 'camera'

import colors from '../utils/colors'
import _ from 'underscore'
import AppActions  from '../flux/actions/AppActions'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import CameraControl from '../controls/cameraControl'

export default class CameraPermissionsModal extends Component{

  constructor(props) {
    super()
    console.log(OSPermissions);
    this.state = {
      image_type: props.image_type,
      failedState: OSPermissions && parseInt(OSPermissions[CameraKey]) < 3  ? true : false,
      hasPermission: OSPermissions && parseInt(OSPermissions[CameraKey]) > 2 ? true : false
    }
  }
  componentWillMount(){
    if(parseInt(OSPermissions[CameraKey]) > 2 ){
      console.log('componentWillMount camera permiss');

      this.props.navigator.push({
        component: (this.props.image_type == 'couple_profile' ? CoupleCameraControl : CameraControl),
        id: 'cc',
      })
    }

  }
  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission ){
      console.log('update push camera route');

      this.props.navigator.replace({
        component:CameraControl,
        id: 'cc',
        passProps:{
          image_type: this.props.image_type
        }
      })
    }

  }
  cancel(){
    this.props.navigator.pop()
  }
  handleTapYes(){
    if(this.state.failedState){
      UrlHandler.openUrl(UrlHandler.settingsUrl)

    }else{
      this.handleSuccess();
    }
  }
  handleFail(){
    this.setState({hasPermission: false})
    AppActions.denyPermission(CameraKey)
  }
  handleSuccess(){
      console.log('handleSuccess');

    this.setState({hasPermission: true})
    AppActions.grantPermission(CameraKey)
    if(this.props.AppState.OSPermissions[CameraKey] > 2 ){
      this.props.navigator.push({
        component: (this.props.image_type == 'couple_profile' ? CoupleCameraControl : CameraControl),
        id: 'cc',
      })
    }

  }
  componentDidMount() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
  }
  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange(currentAppState) {
    if(currentAppState == 'active'){
      const hasPerm = parseInt(require('react-native').NativeModules.OSPermissions['camera']) > 2 ? true : false;
      console.log(hasPerm)
      this.setState({ hasPermission: hasPerm, failedState: false });
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    }
  }

  render(){
    return (
    <PurpleModal>
          <View style={[styles.col,styles.fullWidth,{justifyContent:'space-between'}]}>

        <Image
          style={[{width:150,height:150,borderRadius:75,marginVertical:20}]}
            source={this.state.failedState ? require('../../newimg/iconModalDenied.png') : require('../../newimg/iconModalCamera.png')}/>


        <View style={styles.insidemodalwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>TAKE PHOTO
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
              }]}>
              {this.state.failedState ? `Camera access is disabled. You can enable it in Settings.` : `Take a photo now?`}
            </Text>
            <View>
              <TouchableHighlight
                underlayColor={colors.darkGreenBlue}
                style={styles.modalButtonWrap}
                onPress={this.handleTapYes.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>{this.state.failedState ? `GO TO SETTINGS` : `YES, OPEN CAMERA`}</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View >
              <TouchableOpacity onPress={this.cancel.bind(this)}>
                <View>
                  <Text style={styles.nothankstext}>No thanks</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </PurpleModal>
    )
  }
}
