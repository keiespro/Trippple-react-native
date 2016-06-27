

import React, {Component, PropTypes} from "react";
import { StyleSheet,Modal, Image, Text, ActivityIndicator, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import UserActions from '../flux/actions/UserActions'

import styles from '../modals/purpleModalStyles'
import CouplingNavigator from './CouplingNavigator'

export default class Coupling extends Component{

  constructor(props){
    super()
    console.log(props);
    this.state = { }
  }

  cancel(){
    this.props.close()
  }
  componentDidMount(){
    UserActions.getCouplePin();

  }

  render(){


    return  (
      <View>
        <CouplingNavigator goBack={this.cancel.bind(this)} {...this.props} />
      </View>
    )
  }

}
