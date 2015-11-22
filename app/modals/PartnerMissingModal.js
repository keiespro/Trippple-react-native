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
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  Modal,
  NativeModules
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../DeviceConfig'
const { RNMessageComposer } = NativeModules ;


var passProps = function(component,props) {
  return React.addons.cloneWithProps(component, props);
};

class PartnerMissingModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  cancel(){
    this.props.goBack();
  }
  
    handleSendMessage(){
      RNMessageComposer.composeMessageWithArgs(
      {
          'messageText':'http://appstore.com/trippple',
          'subject':'Come join me on Trippple!',
          'recipients':[this.props.user.invited_partner_phone]
      },
      (result) => {
          switch(result) {
              case RNMessageComposer.Sent:
                  console.log('the message has been sent');
                  break;
              case RNMessageComposer.Cancelled:
                  console.log('user cancelled sending the message');
                  break;
              case RNMessageComposer.Failed:
                  console.log('failed to send the message');
                  break;
              case RNMessageComposer.NotSupported:
                  console.log('this device does not support sending texts');
                  break;
              default:
                  console.log('something unexpected happened');
                  break;
          }
      }
      );
  }
  render(){


    return (
      <View style={[{padding:0,backgroundColor: 'transparent',flex:1,position:'relative'}]}>

        <View style={[styles.col,{justifyContent:'center',alignSelf:'center',backgroundColor: 'transparent'}]}>

          <View style={[styles.modalcontainer,{overflow:'hidden',width:MagicNumbers.screenWidth,backgroundColor:colors.white,
            marginHorizontal:MagicNumbers.screenPadding/2,padding:MagicNumbers.screenPadding/2,
          height:DeviceHeight-MagicNumbers.screenPadding*2,marginTop:MagicNumbers.screenPadding}]} resizeMode={Image.resizeMode.stretch} >
            
            
          <View style={[styles.col,{paddingVertical:10}]}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={[styles.contactthumb,{width:150,height:160,marginVertical:20}]}
              source={require('../../newimg/iconModalMissingPartner.png')}
             />

            <View style={styles.insidemodalwrapper}>


                <Text style={[styles.rowtext,styles.bigtext,{
                    fontFamily:'Montserrat',fontSize:20,marginVertical:10,color: colors.shuttleGray
                  }]}>
                  {`WAITING FOR PARTNER`}
                </Text>

                <Text style={[styles.rowtext,styles.bigtext,{
                    fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
                  }]}>
                  You can not update your prefrences until your partner downloads Trippple and completes the registration.
                </Text>
                  <View>
                    <TouchableHighlight
                      underlayColor={colors.mediumPurple}
                      style={styles.modalButtonWrap}
                      onPress={this.handleSendMessage.bind(this)}>
                      <View style={[styles.modalButton]} >
                        <Text style={styles.modalButtonText}>{`NOTIFY YOUR PARTNER`}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View >
                    <TouchableOpacity onPress={this.cancel.bind(this)}>
                      <View>
                        <Text style={{color:colors.shuttleGray,textAlign:'center'}}>no thanks</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  
                  
                </View>
              </View>
            </View>

        </View>
      </View>

    )
  }
}

export default PartnerMissingModal
