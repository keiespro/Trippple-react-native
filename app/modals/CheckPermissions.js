/* @flow */

import React from "react";

import {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, NativeModules, Settings, CameraRoll, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

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
import {MagicNumbers} from '../DeviceConfig'
import Analytics from '../utils/Analytics'

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
 };

 constructor(props) {
   super();
   this.state = {
     failedState: OSPermissions.location && parseInt(OSPermissions.location) && parseInt(OSPermissions.location) < 3,
     hasPermission: OSPermissions.location && parseInt(OSPermissions.location) && OSPermissions.location > 2

   }
 }

 componentWillMount(){
   // if(OSPermissions[this.props.permissionKey]  && parseInt(OSPermissions[this.props.permissionKey]) > 2){
   //   this.props.failCallback ? this.props.failCallback(true) : this.props.navigator[this.props.renderNextMethod]( this.props.nextRoute )

   // }

 }
 componentDidUpdate(prevProps,prevState){
   if(!prevState.hasPermission && this.state.hasPermission ){
     // this.props.failCallback && this.props.failCallback()
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
       this.handleSuccess(geo)
     },
     (error) => {
       Analytics.log(error)

       // this.setState({hasPermission: false, failedState: true})
       // this.handleFail()
       // this.props.navigator[this.props.renderPrevMethod]()

     },
     {enableHighAccuracy: false, maximumAge: 1} )
 }

 cancel(val){

   this.props.failCallback(val)

   this.props.hideModal()
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
       this.props.successCallback()
       this.props.navigator.pop()

     }
   }



 }

 handleFail(){
   this.setState({hasPermission: false})
   this.props.failCallback(0)
   this.props.navigator.pop()

 }

 handleSuccess(geo){
   const { latitude, longitude } = geo.coords
   UserActions.updateUser({ latitude, longitude });
   this.props.successCallback()
   this.props.navigator.pop()
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
         underlayColor={colors.darkGreenBlue}
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
   return (
     <PurpleModal>
       <View style={[styles.col,styles.fullWidth,{justifyContent:'space-between'}]}>

         <Image
           resizeMode={Image.resizeMode.contain}
           style={[{
             width:MagicNumbers.is4s ? 100 : 150,
             height:MagicNumbers.is4s ? 100 : 150,
             borderRadius:0,
             marginVertical: MagicNumbers.is4s ? 0 : 20
           }]}
           source={
             this.state.failedState ? {uri: 'assets/iconModalDenied@3x.png'} : {uri: 'assets/iconModalDeck@3x.png'}}
         />

       <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>

           <Text style={[styles.rowtext,styles.bigtext,{
               fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10,color: colors.shuttleGray
             }]}>
             {this.state.failedState ? this.props.failedTitle.toUpperCase() : this.props.title.toUpperCase()}
           </Text>

           <Text style={[styles.rowtext,styles.bigtext,{
             fontSize:18,marginVertical:10,color: colors.shuttleGray,marginHorizontal:10,
             marginBottom: MagicNumbers.is4s ? 20 : 30
             }]}>{this.state.failedState ? this.props.failedSubtitle : this.props.subtitle || ''}
           </Text>

           {this.renderButton()}
         </View>

         <View style={{marginTop:MagicNumbers.is4s ? 5 : 20}}>
           <TouchableOpacity style={{padding:10}}
           onPress={()=>this.cancel(false)}>
             <View style={[styles.cancelButton,{ backgroundColor:'transparent'}]} >
               <Text style={[styles.nothankstext,{ backgroundColor:'transparent'}]}>no thanks</Text>
             </View>
           </TouchableOpacity>
         </View>
       </View>
     </PurpleModal>

   )
 }


}
