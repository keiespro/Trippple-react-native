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
  TouchableOpacity
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var {FBLoginManager,AddressBook,OSPermissions} = NativeModules
import UrlHandler from 'react-native-url-handler'
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'

 export default class CheckPermissions extends React.Component{

  static propTypes = {
    nextRoute:PropTypes.object,
    permissionKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    buttonText: PropTypes.string,
    headerImageSource: PropTypes.string,
    renderMethod: PropTypes.oneOf(['push', 'replace','show']),
    renderNextMethod: PropTypes.oneOf(['pop', 'push', 'replace','suppress']),
    renderPrevMethod: PropTypes.oneOf(['pop', 'replace','suppress']),
    successCallback: PropTypes.func
  };

  static defaultProps = {
    buttonText: 'YES'
  }

  constructor(props) {
    super();
    this.state = {
      hasPermission: (parseInt(OSPermissions.location)  &&  OSPermissions.location > 2),
      failedState: (parseInt(OSPermissions.location)  && parseInt(OSPermissions.location) < 2)
    }
  }

  componentWillMount(){
    if(this.props.AppState.permissions[this.props.permissionKey]){
      this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )
    }

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
      this.props.failCallback ? this.props.failCallback(true) : this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )
    }else if(this.state.failedState){

    }
  }

  requestPermission(){
    switch(this.props.permissionKey){
      case 'location':
        this.getLocation()
        break


      case 'facebook':
      default:
        this.doRequest()
        break
    }
  }
  getLocation(){
      navigator.geolocation.getCurrentPosition( (geo) => {
        console.log('x',geo)

        this.handleSuccess(geo)
        this.props.successCallback && this.props.successCallback( geo.coords)
      },
      (error) => {
        this.setState({hasPermission: false, failedState: true})
        console.log('x',error)
        this.handleFail()
        // this.props.navigator[this.props.renderPrevMethod]()

      },
      {enableHighAccuracy: false, maximumAge: 1} )
  }
  doRequest(){
    // this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )
  }



  cancel(val){

    this.props.failCallback(val)

    // this.props.hideModal ? this.props.hideModal() : this.props.navigator.pop()
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
    AppActions.denyPermission(this.props.permissionKey)
    this.props.failCallback(0)

  }

  handleSuccess(geo){
    this.setState({hasPermission: true})
    AppActions.grantPermission(this.props.permissionKey)
    this.cancel(true);
  }

  handleContinue(){
    this.props.nextRoute ? this.props.navigator.replace(this.props.nextRoute) : this.props.continue()
  }

  render(){
    return this.renderModal()
  }


  renderButton(){
    return (
      <View>
        <TouchableHighlight
          underlayColor={colors.mediumPurple}
          style={styles.modalButtonWrap}
          onPress={this.handleTapYes.bind(this)}>
          <View style={[styles.modalButton]} >
            <Text style={styles.modalButtonText}>{this.state.failedState ? 'SETTINGS' : this.props.buttonText}</Text>
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
            resizeMode={Image.resizeMode.contain}

            style={[{width:150,height:150,borderRadius:0,marginVertical:20}]}
            source={require('../../newimg/iconDeck.png')}/>

          <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>
              {this.state.failedState ? this.props.failedTitle : this.props.title}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:18,marginVertical:10,color: colors.lavender,marginHorizontal:10
              }]}>{this.state.failedState ? this.props.failedSubtitle : this.props.subtitle || ''}
            </Text>

            {this.renderButton()}
          </View>

          <View >
            <TouchableOpacity
              onPress={this.cancel.bind(this)}>
              <View style={[styles.cancelButton,{  backgroundColor:'transparent'}]} >
                <Text style={[styles.modalButtonText,{  backgroundColor:'transparent'}]}>No thanks</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </PurpleModal>
    </View>

    )
  }


}
