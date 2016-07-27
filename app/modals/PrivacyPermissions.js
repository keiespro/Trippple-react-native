/* @flow */

import React from "react";

import {Component} from "react";
import {StyleSheet, Text, Image, NativeModules, CameraRoll, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const {OSPermissions} = NativeModules
import ContactGetter from 'react-native-contacts'

import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import UserActions from '../flux/actions/UserActions'
import AppActions from '../flux/actions/AppActions'
import {MagicNumbers} from '../DeviceConfig'

class PrivacyPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {
      failedStateContacts: OSPermissions.contacts && parseInt(OSPermissions.contacts) && OSPermissions.contacts < 3,
      hasContactsPermissions: OSPermissions.contacts && parseInt(OSPermissions.contacts) && OSPermissions.contacts > 2
    }
  }

  componentDidMount(){

     ContactGetter.checkPermission((err, permission) => {
       if(!err && permission === ContactGetter.PERMISSION_AUTHORIZED){
         this.setState({ hasContactsPermissions: true })
       }else if( permission === ContactGetter.PERMISSION_DENIED){
         this.setState({ hasContactsPermissions: false,failedStateContacts:true })
       }else{
         this.setState({ hasContactsPermissions: false })
       }
     })
  }

  componentDidUpdate(pProps,pState){
    if(this.state.hasFacebookPermissions && this.state.hasContactsPermissions && (!pState.hasFacebookPermissions || !pState.hasContactsPermissions )){
      UserActions.updateUser({privacy:'private'})
      AppActions.killModal()
      this.props.success && this.props.success()
      this.props.navigator && this.props.navigator.pop()
    }
  }

  handleTapContacts(){
    if(this.state.hasContactsPermissions) {
        this.getContacts();
    }else{

      ContactGetter.checkPermission((err, permission) => {
        if(err){
         //TODO:  handle err;
        }

       // ContactGetter.PERMISSION_AUTHORIZED || ContactGetter.PERMISSION_UNDEFINED || ContactGetter.PERMISSION_DENIED
       if(permission === ContactGetter.PERMISSION_UNDEFINED){
         this.getContacts();
       }
       if(permission === ContactGetter.PERMISSION_AUTHORIZED){
          this.getContacts()
        }
        if(permission === ContactGetter.PERMISSION_DENIED){

          this.setState({failedStateContacts:true})
        }

      })
    }
  }

  getContacts(){
    ContactGetter.requestPermission((err, permission) => {
    // ContactGetter.getContacts((err, contacts) => {
      // console.log(err, permission)
      if (!err ) {
      //   UserActions.handleContacts.defer(contacts)
        if(permission === ContactGetter.PERMISSION_UNDEFINED){

        }
        if(permission === ContactGetter.PERMISSION_AUTHORIZED){
          this.setState({hasContactsPermissions:true})
         }
         if(permission === ContactGetter.PERMISSION_DENIED){

           this.setState({failedStateContacts:true,hasContactsPermissions:false})
         }

        this.setState({hasContactsPermissions:true})
      //
      }else{
      //
        this.setState({hasContactsPermissions:false})
      //
      }
    })
  }

  render(){

    const {hasContactsPermissions} = this.state

    return (
        <PurpleModal>
          <View style={[styles.col,{justifyContent:'space-between',padding:0}]}>
            <View style={{alignItems:'center'}}>
              <Image
                resizeMode={Image.resizeMode.contain}
                style={[{width:150,
                  height:MagicNumbers.is4s ? 100 : 150,
                  marginBottom:MagicNumbers.is4s ? 15 : 30,
                  marginTop:MagicNumbers.is4s ? 10 : 20}]}
                source={{uri: 'assets/iconModalPrivacy@3x.png'}}
              />
            </View>
            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat-Bold',fontSize:20,marginVertical:0
            }]}
            >PROTECT YOUR PRIVACY</Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:18,marginVertical:10,color: colors.shuttleGray,marginHorizontal:10
              }]}>
              Hide from your Facebook Friends and Phone Contacts
            </Text>

            <View style={{marginTop:20}}>

            <View style={{overflow:'hidden',borderRadius:4,marginTop:20}}>
            <BoxyButton
                text={"BLOCK CONTACTS"}
                buttonText={buttonStyles.buttonText}
                underlayColor={colors.darkGreenBlue}
              innerWrapStyles={[buttonStyles.innerWrapStyles,{overflow:'hidden',borderRadius:4}]}

                leftBoxStyles={ buttonStyles.grayIconbuttonLeftBox}
                _onPress={this.handleTapContacts.bind(this)}>

              {hasContactsPermissions ?
                <Image source={{uri: 'assets/checkmarkWhiteSmall@3x.png'}}
                  resizeMode={Image.resizeMode.cover}
                      style={{height:21,width:30}} /> :
                      <View style={{backgroundColor:colors.darkGreenBlue,height:20,width:20,borderRadius:10,alignSelf:'center'}} /> }
          </BoxyButton>
        </View>
        </View>


            <View
            style={{
                       }} >
          { this.state.hasContactsPermissions ?
              <TouchableOpacity
              style={{width:undefined,paddingHorizontal:10,marginVertical:10,flexDirection:'row',alignSelf:'stretch',flex:1,alignItems:'stretch'}}

                onPress={()=>{AppActions.killModal(); this.props.success && this.props.success()}}>
              <View style={[styles.cancelButton,{backgroundColor:'transparent',alignItems:'stretch',alignSelf:'stretch',flexDirection:'row'}]} >
                <Text style={[{color:colors.shuttleGray,textAlign:'center',
                  padding:10,
                  paddingVertical:MagicNumbers.is4s ? 0 : 20,
                  alignSelf:'stretch'},styles.nothankstext]}>Continue</Text>
                </View>
              </TouchableOpacity>  :
            <TouchableOpacity
              style={{paddingHorizontal:10,marginVertical:10,alignSelf:'stretch',flex:1,alignItems:'stretch'}}
              onPress={this.props.cancel}>
              <View style={[styles.cancelButton,{backgroundColor:'transparent',flex:1,alignItems:'stretch',alignSelf:'stretch'}]} >
                <Text style={[{color:colors.shuttleGray,textAlign:'center',
                  padding:MagicNumbers.is4s ? 0 : 10,
                  alignSelf:'stretch'},styles.nothankstext]}>no thanks</Text>
              </View>
            </TouchableOpacity>}

             </View>

        </View>
      </PurpleModal>
    )
  }
}

PrivacyPermissionsModal.displayName = "PrivacyPermissions"
export default PrivacyPermissionsModal

const buttonStyles = StyleSheet.create({

  privacyStyle:{
    height:60,
  },
  innerWrapStyles:{
    borderColor: colors.darkGreenBlue,
    borderWidth: 1,
    borderRadius:8,
    width:MagicNumbers.screenWidth,
    overflow:'hidden',

    backgroundColor:colors.sushi
  },

  iconButtonOuter:{
    marginTop:20
  },
  grayIconbuttonLeftBox:{
    backgroundColor: colors.darkGreenBlue40,
    borderRightColor: colors.darkGreenBlue,
    borderRightWidth: 1,
  },



  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },

  buttonText:{
    color:colors.white,
    fontSize:18,
    fontFamily:'Montserrat-Bold'
  },

})
