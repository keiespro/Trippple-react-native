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
  TouchableHighlight,
  Dimensions,
  NativeModules,
  PropTypes,
  PixelRatio
} from 'react-native'
import Camera from 'react-native-camera';
import CoupleCameraControl from '../controls/CoupleCameraControl'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {CameraManager,UrlHandler} = NativeModules

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
    this.state = {
      image_type: props.image_type,
      failedState: parseInt(props.AppState.OSPermissions) && props.AppState.OSPermissions[CameraKey] < 3|| false,
      hasPermission:parseInt(props.AppState.OSPermissions) && props.AppState.OSPermissions[CameraKey] > 2 ? true : false
    }
  }
  componentDidMount(){
    if(this.props.AppState.OSPermissions[CameraKey] > 2 ){
      this.props.navigator.push({
        component: (this.props.image_type == 'couple_profile' ? CoupleCameraControl : CameraControl),
        id: 'cc',
      })
    }

  }
  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission ){
      this.props.navigator.push({
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
      var fetchParams: Object = {
        first: 1,
        groupTypes: 'All',
        assetType: 'Photos',
      };
      CameraRoll.getPhotos(fetchParams, this.handleSuccess.bind(this), this.handleFail.bind(this),);
    }
  }
  handleFail(){
    this.setState({hasPermission: false})
    AppActions.denyPermission(CameraKey)
  }
  handleSuccess(){
    this.setState({hasPermission: true})
    AppActions.grantPermission(CameraKey)
  }

  render(){
    return (
    <PurpleModal>
      <View style={[styles.col,{paddingVertical:10}]}>
        <Image
          style={[{width:150,height:150,borderRadius:75,marginVertical:20}]}
            source={this.state.failedState ? require('../../newimg/iconModalDenied.png') : require('../../newimg/iconModalCamera.png')}/>


        <View style={styles.insidemodalwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>TAKE PHOTO
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              {this.state.failedState ? `Camera access is disabled. You can enabled it in Settings.` : `Take a photo now?`}
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
              <TouchableHighlight onPress={this.cancel.bind(this)}>
                <View>
                  <Text style={styles.modalButtonText}>No thanks</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </PurpleModal>
    )
  }
}
