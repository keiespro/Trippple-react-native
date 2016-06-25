/* @flow */

import React from "react";

import {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, NativeModules, Settings,ScrollView, CameraRoll, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var {OSPermissions} = NativeModules
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
import { BlurView,VibrancyView} from 'react-native-blur'

export default class LocationPermission extends React.Component{

 static propTypes = {
   nextRoute:PropTypes.object,
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
     hasPermission: OSPermissions.location && parseInt(OSPermissions.location) && parseInt(OSPermissions.location) > 2

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
       this.getLocation()
 }
 getLocation(){
     navigator.geolocation.getCurrentPosition( (geo) => {
       this.handleSuccess && this.handleSuccess(geo)
       this.props.closeModal && this.props.closeModal()
       this.props.close && this.props.close()
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
   this.props.closeModal()
  //  this.props.navigator.pop()
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
       style={{backgroundColor:'transparent',borderColor:colors.white,borderWidth:1,borderRadius:5,marginHorizontal:10,marginTop:20,marginBottom:15}}
       onPress={this.handleTapYes.bind(this)}>
       <View style={{paddingVertical:20}} >
         <Text style={[styles.modalButtonText,{fontFamily:'Montserrat-Bold'}]}>
           {
             `YES PLEASE`
           }
         </Text>
       </View>
     </TouchableHighlight>
     </View>
   )
 }

 renderModal(){
    return (
     <View>
       {/*<BlurView
         blurType="dark"
         style={[{position:'absolute',top:0,width:DeviceWidth,height:DeviceHeight,justifyContent:'center',alignItems:'center',flexDirection:'column'}]}
       />*/}
       <ScrollView
         style={[{padding:0,width:DeviceWidth,height:DeviceHeight,backgroundColor: 'transparent',paddingTop:20,flex:1,position:'relative',paddingHorizontal:MagicNumbers.screenPadding/2}]}
         contentContainerStyle={{justifyContent:'center',alignItems:'center',}}
       >
       <View style={{width:240,height:240,marginVertical:10,flex:1,position:'relative',alignItems:'center',justifyContent:'center'}}>
       <Image style={[{width:140,height:140,borderRadius:70,top:0,left:0,margin:50,position:'absolute'}]} source={ {uri: this.props.user.image_url }} />
       <Image
         style={{width:240,height:240,marginVertical:0,top:0,left:0,padding:50,padding:0,position:'absolute'}}
         resizeMode="cover"
         source={ {uri: 'assets/localIcon@3x.png' }}
         />
     </View>
       <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>

           <Text style={[styles.rowtext,styles.bigtext,{
               fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10,color: colors.white
             }]}>
             {this.state.failedState ? this.props.failedTitle.toUpperCase() : this.props.title.toUpperCase()}
           </Text>

           <Text style={[styles.rowtext,styles.bigtext,{
             fontSize:18,color: colors.white,marginHorizontal:MagicNumbers.screenPadding,
             marginBottom: MagicNumbers.is5orless ? 10 : 20
           }]}>We’ve found 10 matches we think you might like.</Text>
             <Text style={[styles.rowtext,styles.bigtext,{
               fontSize:18,color: colors.white,marginHorizontal:MagicNumbers.screenPadding,
               marginBottom: MagicNumbers.is5orless ? 10 : 20
               }]}>Should we prioritize the matches closets to you?</Text>

           {this.renderButton()}
         </View>

         <View style={{marginTop:MagicNumbers.is5orless ? 5 : 10}}>
           <TouchableOpacity style={{padding:10}}
           onPress={()=>this.cancel(false)}>
             <View style={[styles.cancelButton,{ backgroundColor:'transparent'}]} >
               <Text style={[styles.nothankstext,{color:colors.warmGreyTwo,fontFamily:'Omnes-Light', backgroundColor:'transparent'}]}>No Thanks</Text>
             </View>
           </TouchableOpacity>
         </View>
       </ScrollView>
       </View>

   )
 }


}
