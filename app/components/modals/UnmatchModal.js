'use strict';

import {
  Text,
  Image,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../../utils/colors'
import _ from 'underscore'

import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../../utils/DeviceConfig'


import PurpleModal from './PurpleModal'

class UnmatchModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  unMatch(){
    // MatchActions.unMatch(this.props.match)//todo: fix
    this.props.goBack();
  }

  render(){
    var rowData = this.props.match,
        theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
        them = theirIds.map((id)=> rowData.users[id]),
        matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & '),
        modalVisible = this.state.isVisible,
        self = this,
        matchImage = them.couple && them.couple.thumb_url || them[0].thumb_url || them[1].thumb_url;

    return (
      <PurpleModal>
        <View style={[styles.col,styles.fullWidth]}>
             <View style={styles.insidemodalwrapper}>
             <View style={{alignItems:'center'}}>
             <Image
            style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20}]}
            source={{uri:matchImage}}
            defaultSource={{uri: 'assets/placeholderUserWhite@3x.png'}} />
                </View>

              <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:20,marginVertical:10
                }]}>UNMATCH {matchName}</Text>

              <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:20
                }]}>
                Are you sure?
              </Text>
              <View style={[{marginTop:20}]}>
                <TouchableHighlight
                  underlayColor={colors.sushi}
                  style={styles.modalButtonWrap}
                  onPress={this.unMatch.bind(this)}>
                  <View style={[styles.modalButton]} >
                    <Text style={styles.modalButtonText}>UNMATCH</Text>
                  </View>
                </TouchableHighlight>
              </View>

            <View >
              <TouchableHighlight
                underlayColor={'transparent'}
                style={styles.modalButtonWrap}
                onPress={this.props.goBack}>
                <View style={[styles.modalButton,styles.cancelButton]} >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </PurpleModal>
    )
  }
}
UnmatchModal.displayName = "UnmatchModal"
export default UnmatchModal
