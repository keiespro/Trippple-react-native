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
import PurpleModal from './PurpleModal'

var passProps = function(component,props) {
  return React.cloneElement(component, props);
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
        'messageText':'Come join me on Trippple! http://appstore.com/trippple',
        'recipients':[this.props.user.partner.phone]
      },
      (result) => {
        switch(result) {
          case RNMessageComposer.Sent:
            break;
          case RNMessageComposer.Cancelled:
            break;
          case RNMessageComposer.Failed:
            break;
          case RNMessageComposer.NotSupported:
            break;
          default:
            break;
        }
      }
    );
  }
  render(){
    return (
    <PurpleModal>
          <View style={[styles.col,styles.fullWidth,{justifyContent:'space-between'}]}>

              <Image
                resizeMode={Image.resizeMode.contain}
                style={[styles.contactthumb,{
                  width:150,
                  height:160,
                  marginTop:20,
                    marginBottom:MagicNumbers.isSmallDevice ? 10 : 20
}]}
                source={require('../../newimg/iconModalMissingPartner.png')}
               />

              <View style={styles.insidemodalwrapper}>

                <Text style={[styles.rowtext,styles.bigtext,{
                    fontFamily:'Montserrat-Bold',fontSize:22,marginVertical:10,color: colors.shuttleGray
                  }]}>
                  {`WAITING FOR PARTNER`}
                </Text>

                <Text style={[styles.rowtext,styles.bigtext,{
                    fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal: 0
                  }]}>
                  You can not {this.props.nameOfDeniedAction || `update your prefrences`} until your partner downloads Trippple and completes the registration on their phone.
                </Text>
                <View>
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    style={[styles.modalButtonWrap,{marginVertical:30}]}
                    onPress={this.handleSendMessage.bind(this)}
                    >
                    <View style={[styles.modalButton]} >
                      <Text style={styles.modalButtonText}>{`NOTIFY YOUR PARTNER`}</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View>
                  <TouchableOpacity onPress={this.cancel.bind(this)}>
                    <View>
                      <Text style={{color:colors.shuttleGray,textAlign:'center'}}>no thanks</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </PurpleModal>

    )
  }
}

export default PartnerMissingModal
