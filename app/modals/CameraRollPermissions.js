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
  TouchableOpacity,
  Dimensions,
  NativeModules,
  PixelRatio,
  AppStateIOS
} from 'react-native'

const permissionsKey = 'cameraRoll'
import UrlHandler from 'react-native-url-handler'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const {OSPermissions} = NativeModules
import CameraRollView from '../controls/CameraRollView'

import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import AppActions from '../flux/actions/AppActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'

export default class CameraRollPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {
      image_type: props.image_type,
      failedState: OSPermissions.cameraRoll && parseInt(OSPermissions.cameraRoll) && parseInt(OSPermissions.cameraRoll) < 3,
      hasPermission: OSPermissions.cameraRoll && parseInt(OSPermissions.cameraRoll) && OSPermissions.cameraRoll > 2

    }
  }

  _handleAppStateChange(currentAppState) {
    if(currentAppState == 'active'){
      OSPermissions.canUseCamera( (permission) => {
        this.setState({ hasPermission: parseInt(permission > 2) ? true : false, failedState: false });
        AppStateIOS.removeEventListener('change', this._handleAppStateChange);
      })
    }
  }


   componentDidMount(){
     if(this.state.hasPermission){
       this.props.navigator.replace({
         component:CameraRollView,
         passProps:{
          image_type:this.props.image_type
         },

       })
     }else{
      AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
    }
  }
  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission){
      this.props.navigator.replace({
        component:CameraRollView,
        passProps:{
          image_type:this.props.image_type
        },
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

    this.setState({failedState:true})

  }
  handleSuccess(){

    // AppActions.grantPermission(permissionsKey)
    this.setState({hasPermission:true})


  }
  render(){


    return (
    <PurpleModal>
      <View style={[styles.col,styles.fullWidth,{justifyContent:'space-between'}]}>

        <Image
          resizeMode={Image.resizeMode.contain}
          style={[styles.contactthumb,{width:150,height:150,borderRadius:0,marginVertical:20}]}
          source={this.state.failedState ? {uri:'assets/iconModalDenied.png'} : {uri:'assets/iconModalAlbum.png'}}
        />
        <View style={styles.insidemodalwrapper}>
          <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10
          }]}>YOUR PHOTO ALBUM</Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
              }]}>
              {this.state.failedState ? `Access to iPhone Photo Album is disabled. You can enable it in Settings` : `Do you want to upload an image from your iPhone Photo Album?`}
            </Text>
            <View >
              <TouchableHighlight
                underlayColor={colors.darkGreenBlue}
                style={styles.modalButtonWrap}
                onPress={this.handleTapYes.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>{this.state.failedState ? `GO TO SETTINGS` : `YES, OPEN MY ALBUMS`}</Text>
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
