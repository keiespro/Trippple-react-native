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
  PropTypes,
  PixelRatio
} from 'react-native'
import Camera from 'react-native-camera';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

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
    console.log(props)
    super();
    this.state = {
      hasPermission: props.AppState && props.AppState.permissions[CameraKey]
    }
  }
  componentWillMount(){
    if(this.props.AppState.permissions[CameraKey]){
      this.props.navigator.push({
        component:CameraControl,
        passProps:{ }
      })
    }
  }
  componentDidMount(){
    if(this.state.hasPermission && this.state.hasPermission == true ){
      this.props.navigator.push({
        component:CameraControl,
        passProps:{ }
      })
    }
  }
  componentDidUpdate(prevProps,prevState){

    if( this.state.hasPermission && !prevState.hasPermission){
      this.props.navigator.replace({
        component:CameraControl,
        passProps:{
        }
      })
    }

  }
  cancel(){
    this.props.navigator.pop()
  }
  handleTapYes(){
    this.handleSuccess()
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
          style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginVertical:20}]}
          source={require('image!iconAlbum')}
          defaultSource={require('image!placeholderUserWhite')} />

        <View style={styles.insidemodalwrapper}>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>YOUR CAMERA
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              Take a photo now?
            </Text>
            <View>
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.handleTapYes.bind(this)}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>YES, OPEN CAMERA</Text>
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
          {this.state.renderHiddenCamera ? <Camera/> : null}
        </View>
      </View>
      </PurpleModal>
    )
  }
}
