
import React, {Component} from "react";
import {StyleSheet, Text, TextInput, View, AsyncStorage, Image, TouchableHighlight, TouchableOpacity, LayoutAnimation, Dimensions} from "react-native";

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import BoxyButton from '../../controls/boxyButton'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import LoadingOverlay from '../../components/LoadingOverlay'

class Limbo extends Component{
  componentWillMount(){
    UserActions.updateUser({status:'onboarded'})
  }
  render(){
    return (
      <LoadingOverlay isVisible={true}/>
    )
  }
}
export default Limbo

const styles = StyleSheet.create({
 buttonText: {
   fontSize: 18,
   color: '#111',
   alignSelf: 'center',
   fontFamily:'omnes'

 },
 button: {
   height: 45,
   flexDirection: 'row',
   backgroundColor: '#FE6650',
   borderColor: '#111',
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   marginTop: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
 },
})
