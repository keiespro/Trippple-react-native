/* @flow */

import React from "react";

import {Component} from "react";
import {StyleSheet, Text, Image, View,ScrollView, Alert, TextInput, ListView, TouchableHighlight, Dimensions, PixelRatio, Modal} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../DeviceConfig'


var passProps = function(component,props) {
  return React.cloneElement(component, props);
};

class PurpleModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  cancel(){
    this.props.goBack && this.props.goBack();
    this.props.navigator && this.props.navigator.pop()
  }
  render(){


    return (
      <View style={[{padding:0,backgroundColor: 'transparent',flex:1,position:'absolute',height:DeviceHeight,width:DeviceWidth,justifyContent:'center',top:0,alignItems:'center',}]}>
        <BlurView blurType="dark" style={{position:'absolute',height:DeviceHeight,width:DeviceWidth,top:0,}} />



        <ScrollView contentContainerStyle={[styles.modalcontainer,styles.fullWidth,{height:DeviceHeight,
              justifyContent:'center',alignItems:'stretch',backgroundColor: 'transparent',
          }]} style={[{ flex:1, }]}>
           {this.props.children}
          </ScrollView>

      </View>

    )
  }
}

export default PurpleModal
