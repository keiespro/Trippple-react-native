/* @flow */

import React from "react";

import {Component} from "react";
import {StyleSheet, Text, Image, View, AlertIOS, TextInput, ListView, TouchableHighlight, Dimensions, PixelRatio, Modal} from "react-native";

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
    this.props.goBack();
  }
  render(){


    return (
      <View style={[{padding:0,backgroundColor: 'transparent',flex:1,position:'relative',justifyContent:'center',alignItems:'center',}]}>

      <View style={[styles.col,{justifyContent:'center',alignItems:'center',backgroundColor: 'transparent',
      }]}>

        <View style={[styles.modalcontainer,{
          backgroundColor:colors.white,
          flex:1,
        }]}  >
            {this.props.children}
          </View>
        </View>
      </View>

    )
  }
}

export default PurpleModal
