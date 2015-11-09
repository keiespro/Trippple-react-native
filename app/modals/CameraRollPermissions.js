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
  PixelRatio,
  AppStateIOS
} from 'react-native'

const permissionsKey = 'cameraRoll'
import UrlHandler from 'react-native-url-handler'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

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
    console.log(props.AppState.OSPermissions)
    this.state = {
      failedState: parseInt(props.AppState.OSPermissions) && props.AppState.OSPermissions.cameraRoll < 3|| false,
      hasPermission:parseInt(props.AppState.OSPermissions) && props.AppState.OSPermissions.cameraRoll > 2 ? true : false
    }
  }


  // componentDidMount(){
  //   if(this.state.hasPermission){
  //     this.props.navigator.replace({
  //       component:CameraRollView,
  //       passProps:{
  //       },
  //
  //     })
  //   }
  // }
  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission){
      this.props.navigator.replace({
        component:CameraRollView,
        passProps:{
          // ...this.props,
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

      AppActions.denyPermission(permissionsKey)
      this.setState({failedState:true})

  }
  handleSuccess(){
    console.log('HANDLE SUCCESS ' )

    // AppActions.grantPermission(permissionsKey)
    this.setState({hasPermission:true})


  }
  componentDidMount() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
  }
  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange(currentAppState) {
    if(currentAppState == 'active'){
      const hasPerm = require('react-native').NativeModules.OSPermissions['cameraRoll']
      console.log(hasPerm)
      this.setState({ hasPermission: hasPerm });
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    }
  }
  render(){


    return (
    <PurpleModal>
      <View style={[styles.col,{paddingVertical:10}]}>
        <Image
          resizeMode={Image.resizeMode.contain}

          style={[styles.contactthumb,{width:150,height:150,borderRadius:0,marginVertical:20}]}
          source={require('../../newimg/iconAlbum.png'))} />

        <View style={styles.insidemodalwrapper}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>YOUR PHOTO ALBUM
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              {this.state.failedState ? `Access to iPhone Photo Album is disabled. You can enable it in Settings` : `Do you want to upload an image from your iPhone Photo Album?`}
            </Text>
            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.handleTapYes.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>{this.state.failedState ? `GO TO SETTINGS` : `YES, OPEN MY ALBUMS`}</Text>
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
