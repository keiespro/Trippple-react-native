/* @flow */

import React from "react";

import {StyleSheet, Text, Image, View, AlertIOS, TextInput, ListView, Modal, TouchableHighlight, Animated, Easing, Dimensions, TouchableWithoutFeedback, ActivityIndicatorIOS} from "react-native";
import ContinueButton from '../../controls/ContinueButton'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import _ from 'underscore'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import styles from './contactStyles'
import {MagicNumbers} from '../../DeviceConfig'

class CoupleInvitation extends React.Component{
  constructor(props){
    super()
  }
  render(){

    return (
      <View style={{width:DeviceWidth,height:DeviceHeight,position:'relative',backgroundColor:colors.outerSpace}}>


      <Image style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginBottom:20,marginTop:40,
        backgroundColor:colors.shuttleGray}]}
        />

        <View style={{alignSelf:'stretch', justifyContent:'center',alignItems:'center'}}>

          <Text style={[styles.rowtext,styles.bigtext,{alignSelf:'center',color:colors.shuttleGray,
            fontFamily:'Montserrat',fontSize:22,marginVertical:10,textAlign:'center',
          }]}>
          {`Welcome`}
          </Text>
        </View>
        <View style={{marginBottom:10}} >
          <TouchableOpacity onPress={this.props.denyInvitation}>
            <View style={{width:MagicNumbers.screenWidth-40,flex:1,alignSelf:'stretch'}}>
              <Text style={[{color:colors.rollingStone}]}>{ 'NO'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ContinueButton
        canContinue={false}
        handlePress={this.props.acceptInvitation} />

         </View>

    )
  }
}


export default CoupleInvitation
