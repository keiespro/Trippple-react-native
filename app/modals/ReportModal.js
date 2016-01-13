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
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  Modal
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../DeviceConfig'


import PurpleModal from './PurpleModal'

export default class ReportModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }

  report(them, reason){

    MatchActions.reportUser(them && them.id ? them : them[0], reason)
    this.props.goBack();

  }

  render(){
    if(this.props.match){
      var {match} = this.props
      var theirIds = Object.keys(match.users).filter( (u)=> u != this.props.user.id)
      var them = theirIds.map((id)=> match.users[id])
    }else{
      var {potential} = this.props,
          them = [potential.user,potential.partner]
    }
    var matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & ');

    return (
      <PurpleModal>

        <View style={[styles.col,styles.fullWidth]}>

          <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>REPORT {matchName}</Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.shuttleGray,marginHorizontal:10
              }]}>
              Is this person bothering you?
              Tell us what they did.
            </Text>

              <View style={{marginTop:30,alignSelf:'stretch'}}>
                <TouchableHighlight
                  style={styles.modalButtonWrap}
                  underlayColor={colors.mediumPurple}
                  onPress={this.report.bind(this,them,'image')}>
                  <View style={styles.modalButton} >
                    <Text style={styles.modalButtonText}>OFFENSIVE BEHAVIOR</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
                  style={styles.modalButtonWrap}
                  onPress={this.report.bind(this,them,'fake')}>
                  <View style={[styles.modalButton]} >
                    <Text style={styles.modalButtonText}>FAKE USER</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
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
