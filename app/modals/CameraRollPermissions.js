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
  PixelRatio
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
    this.state = {
      hasPermission:false
    }
  }

  componentDidMount(){
    if(this.props.AppState.permissions[permissionsKey]){
      this.handleSuccess()
    }
  }

  componentDidMount(){
    if(this.state.hasPermission){
      this.props.navigator.replace({
        component:CameraRollView,
        passProps:{
          ...this.props,
        }
      })
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(!prevState.hasPermission && this.state.hasPermission){
      this.props.navigator.replace({
        component:CameraRollView,
        passProps:{
          ...this.props,
        }
      })
    }
  }
  // preloadPermission(){
  //   var hasPermission = await AsyncStorage.getItem(permissionsKey)
  //
  //   try {
  //     this.setState({hasPermission})
  //   } catch (error) {
  //     this.setState({hasPermission: 'false'})
  //     console.log('AsyncStorage error: ' + error.message);
  //   }
  // }
  cancel(){
    this.props.navigator.pop()
  }
  handleTapYes(){
    if(this.state.isFailed){
      UrlHandler.openUrl(UrlHandler.settingsUrl)

    }
    var fetchParams: Object = {
      first: 1,
      groupTypes: 'All',
      assetType: 'Photos',
    };
    CameraRoll.getPhotos(fetchParams, this.handleSuccess.bind(this), this.handleFail.bind(this),);

  }
  handleFail(){

      this.setState({isFailed:true})
      AppActions.denyPermission(permissionsKey)
  }
  handleSuccess(){
    console.log('HANDLE SUCCESS ' )

    this.setState({hasPermission:true})
    AppActions.grantPermission(permissionsKey)


  }

  render(){


    return (
    <PurpleModal>
      <View style={[styles.col,{paddingVertical:10}]}>
        <Image
          resizeMode={Image.resizeMode.contain}

          style={[styles.contactthumb,{width:150,height:150,borderRadius:0,marginVertical:20}]}
          source={require('image!iconAlbum')} />

        <View style={styles.insidemodalwrapper}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>YOUR PHOTO ALBUM
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              Do you want to upload an image from your iPhone Photo Album?
            </Text>
            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.handleTapYes.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>{this.state.isFailed ? `GO TO SETTINGS` : `YES, OPEN MY ALBUMS`}</Text>
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
