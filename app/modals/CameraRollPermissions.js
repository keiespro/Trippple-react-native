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

const STORAGE_KEY = '@permission:cameraRoll'

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
    this.state = {}
  }
  componentWillMount(){
    this.preloadPermission()
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
  async preloadPermission(){
    try {
      var hasPermission = await AsyncStorage.getItem(STORAGE_KEY)
      this.setState({hasPermission})
    } catch (error) {
      this.setState({hasPermission: 'false'})
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  cancel(){
    this.props.navigator.pop()
  }
  handleTapYes(){

    var fetchParams: Object = {
      first: 1,
      groupTypes: 'All',
      assetType: 'Photos',
    };
    CameraRoll.getPhotos(fetchParams, this.handleSuccess.bind(this), this.handleFail.bind(this),);

  }
  handleFail(){
      // AppActions.grantPermission('facebook') // kind of superflous since we have their token but let's be congruent?
  }
  async handleSuccess(){
    console.log('HANDLE SUCCESS ' )

    try {
      var hasPermission = await AsyncStorage.setItem(STORAGE_KEY, 'true')
      this.setState({hasPermission})

    } catch (error) {
      console.log('AsyncStorage error: ' + error.message)
    }

  }

  render(){


    return (
    <PurpleModal>
      <View style={[styles.col,{paddingVertical:10}]}>
        <Image
          style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginVertical:20}]}
          source={require('image!iconAlbum')}
          defaultSource={require('image!placeholderUserWhite')} />

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
                  <Text style={styles.modalButtonText}>YES, OPEN MY ALBUMS</Text>
                </View>
              </TouchableHighlight>
            </View>

          <View >
            <TouchableHighlight
              underlayColor={colors.mediumPurple}
              style={styles.modalButtonWrap}
              onPress={this.cancel.bind(this)}>
              <View style={[styles.modalButton,styles.cancelButton]} >
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
