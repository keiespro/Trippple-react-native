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
import styles from './contactStyles'
import InvitePartner from './invitePartner'
import {MagicNumbers} from '../../DeviceConfig'

@reactMixin.decorate(TimerMixin)
class ConfirmPartner extends React.Component{
  _cancel(){
    this.props.navigator.pop()
  }

  _confirm(number){
    var partner_phone = number || this.props.partner.phoneNumbers[0].number;

    UserActions.selectPartner({
      phone: partner_phone,
      name: this.props.partner.firstName
    })
    const rs = this.props.navigator.getCurrentRoutes()
    this.setTimeout(()=>{
      this.props._continue();
    },500);
  }
  _selectNumber(number){
    this._confirm(number)
}
// componentDidMount(){
// }
  render(){
    if(!this.props.partner){ return false }
    const invitedName = this.props.partner.firstName && this.props.partner.firstName.toUpperCase() || '',
          manyPhones = this.props.partner.phoneNumbers && this.props.partner.phoneNumbers.length;

    return (
      <PurpleModal >
          <View style={[styles.col,styles.fullWidth,{backgroundColor:'transparent',justifyContent:'space-between'}]}>


              <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20,marginTop:40,
                backgroundColor:colors.shuttleGray}]}
                source={{uri: this.props.partner.image || '../../newimg/placeholderUser.png'}}
              />

              <View style={{alignSelf:'stretch', justifyContent:'center',alignItems:'center'}}>

                <Text style={[styles.rowtext,styles.bigtext,{alignSelf:'center',color:colors.shuttleGray,
                      fontFamily:'Montserrat',fontSize:22,marginVertical:10,textAlign:'center',
                }]}>
                  {`INVITE ${invitedName}`}
                </Text>

                <Text style={[styles.rowtext,styles.bigtext,{alignSelf:'center',textAlign:'center',
                    fontSize:22,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
                  }]}>{this.props.partner.phoneNumbers && this.props.partner.phoneNumbers.length > 1 ?
                `What number should we use to invite ${this.props.partner.firstName}` :
                `Invite ${this.props.partner.firstName} as your partner?`
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

                      <TouchableHighlight underlayColor={colors.mediumPurple} style={styles.modalButton}
                        onPress={this._confirm.bind(this)}>
                      <View style={{height:60,flex:1,alignSelf:'stretch',width:MagicNumbers.screenWidth-40}} >


                        <Text style={[styles.modalButtonText,{marginTop:15}]}>YES</Text>
                      </View>
                     </TouchableHighlight>
                      </View>

              }


                      <View style={{height: 70,marginBottom:50}} >

              <TouchableHighlight style={[styles.modalButton,{backgroundColor:'transparent',borderColor:colors.lavender}]} underlayColor={colors.mediumPurple}  onPress={this._cancel.bind(this)}>
                <View style={{width:MagicNumbers.screenWidth-40,height:60,flex:1,alignSelf:'stretch'}}>
                <Text style={[styles.modalButtonText,{color:colors.lavender,marginTop:15}]}>{
                  manyPhones ? 'CANCEL' : 'NO'}</Text>
                </View>
              </TouchableHighlight>
         </View>
         </View>
      </PurpleModal>
    )
  }
}


export default ConfirmPartner
