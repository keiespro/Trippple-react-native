/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  AlertIOS,
  TextInput,
  ListView,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
 TouchableWithoutFeedback,
  ActivityIndicatorIOS
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import UserActions from '../../flux/actions/UserActions'
import CoupleImage from './CoupleImage'
import { AddressBook } from 'NativeModules'
import colors from '../../utils/colors'
import _ from 'underscore'
import Facebook from './facebook'
import BackButton from './BackButton'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import Api from '../../utils/api'
import PurpleModal from '../../modals/PurpleModal'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import AppActions from '../../flux/actions/AppActions'
import styles from './contactStyles'
import InvitePartner from './invitePartner'
import {MagicNumbers} from '../../DeviceConfig'
import libphonenumber from 'google-libphonenumber';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();



class ConfirmPartner extends React.Component{
  _cancel(){
    this.props.navigator.pop()
  }

  _confirm(number){
    var partner_phone = number || this.props.partner.phoneNumbers[0].number;

    var phoneNumber = phoneUtil.parse(partner_phone, 'US');

    if(phoneUtil.isValidNumber(phoneNumber)){
      let phone = phoneUtil.format(phoneNumber,'US');
      UserActions.selectPartner({
        phone,
        name: this.props.partner.firstName || this.props.partner.displayName,
      })
      const rs = this.props.navigator.getCurrentRoutes()
      this.setTimeout(()=>{
        this.props._continue();
      },500);
    }else{
            AlertIOS.alert(
              'Error',
              'This is not a valid phone number. If you\'re sure it is a valid number, please contact us.',
              [
                {text: 'Contact us', onPress: () => AppActions.sendFeedback('ConfirmPartner','Help! My partner\'s phone number is invalid.', 'Partner Phone: '+partner_phone)},
                {text: 'OK', onPress: () => this.props.navigator.pop()},
              ]
            )
          }
  }
  _selectNumber(number){
    this._confirm(number)
  }
  render(){
    const hasPhone = this.props.partner && this.props.partner.phoneNumbers && this.props.partner.phoneNumbers.length && this.props.partner.phoneNumbers.length > 0 && this.props.partner.phoneNumbers[0].number;
    if(!this.props.partner || !hasPhone){ return false }

    const invitedName = this.props.partner.firstName && this.props.partner.firstName.toUpperCase() || '',
          manyPhones = this.props.partner.phoneNumbers && this.props.partner.phoneNumbers.length;

    return (
      <PurpleModal >
          <View style={[styles.col,styles.fullWidth,{flexDirection:'column',paddingHorizontal:20,backgroundColor:'transparent',alignItems:'center',justifyContent:'space-between'}]}>


          <Image
          style={[{borderRadius:75,
            width:150,height:150,marginBottom:20,marginTop:40}]}
            resizeMode={Image.resizeMode.contain}
            source={this.props.partner.image && this.props.partner.image != '' && this.props.partner.image != null ?  {uri: this.props.partner.image} : {uri: 'assets/placeholderUser@3x.png'}}
              />

              <View style={{alignSelf:'center',flexDirection:'column', marginBottom:20,justifyContent:'center',alignItems:'center'}}>

                <Text style={[styles.rowtext,styles.bigtext,{alignSelf:'center',color:colors.shuttleGray,
                      fontFamily:'Montserrat',fontSize:22,marginVertical:10,textAlign:'center',
                }]}>
                  {`INVITE ${invitedName}`}
                </Text>

                <Text style={[styles.rowtext,styles.bigtext,{alignSelf:'center',textAlign:'center',
                    fontSize:22,marginVertical:10,color: colors.shuttleGray,flex:1,
                  }]}>{this.props.partner.phoneNumbers && this.props.partner.phoneNumbers.length > 1 ?
                `What number should we use to invite ${this.props.partner.firstName}` :
                `Invite ${this.props.partner.firstName} as your partner? \n ${this.props.partner.phoneNumbers[0].number}`
                  }
                </Text>

              </View>
              { this.props.partner.phoneNumbers &&
                this.props.partner.phoneNumbers.length &&
                this.props.partner.phoneNumbers.length > 1 &&
                this.props.partner.phoneNumbers.map( (number, i) => {
                  return (
                      <View style={{height:70}} >


                      <TouchableHighlight
                        underlayColor={colors.mediumPurple}
                        style={styles.modalButton}
                        onPress={()=>{
                          this._selectNumber( number.number )
                        }}>
                    <View style={{height:60,flex:1,width:MagicNumbers.screenWidth-40}} >
                      <Text style={[styles.modalButtonText,{marginTop:15}]}>{number.number}</Text>
                    </View>
                   </TouchableHighlight>
                   </View>

                )
              })}
              { this.props.partner &&
                  this.props.partner.phoneNumbers &&
                  this.props.partner.phoneNumbers.length &&
                  this.props.partner.phoneNumbers.length == 1 &&
                  <View style={{height:70,flex:1,alignSelf:'stretch'}} >

                  <TouchableHighlight underlayColor={colors.mediumPurple} style={[styles.modalButton,{
                    overflow:'hidden'}]}
                    onPress={()=>{this._confirm(this.props.partner.phoneNumbers[0].number)}}>
                    <View style={{height:60,flex:1,width:MagicNumbers.screenWidth-40,overflow:'hidden'}} >



                    <Text style={[styles.modalButtonText,{marginTop:15}]}>YES</Text>
                    </View>
                    </TouchableHighlight>
                    </View>

              }


                      <View style={{height: 70,marginBottom:50}} >

                      <TouchableOpacity
                      style={[styles.modalButton,{backgroundColor:'transparent',borderColor:'transparent'}]}
                      onPress={this._cancel.bind(this)}>
                <View style={{width:MagicNumbers.screenWidth-40,height:60,flex:1,alignSelf:'stretch'}}>
                <Text style={[styles.modalButtonText,{color:colors.dark,marginTop:15}]}>{
                  manyPhones ? 'CANCEL' : 'NO'}</Text>
                </View>
              </TouchableOpacity>
         </View>
         </View>
      </PurpleModal>
    )
  }
}
reactMixin(ConfirmPartner.prototype, TimerMixin)


export default ConfirmPartner
