import {StyleSheet, Text, View, TouchableHighlight,Dimensions,Alert} from "react-native";
import React from "react";


import colors from '../../utils/colors';
import ActionMan from  '../../actions/';



const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width



export default class LogOutButton extends React.Component{
  _doLogOut(){
     Alert.alert(
      'Log Out of Trippple',
      'Are you sure you want to log out?',
      [
        {text: 'Yes', onPress: () => {
          this.props.dispatch(ActionMan.logOut())

        }},
        {text: 'No', onPress: () => {return false}},
      ]
    )

  }
  render(){

    return (
      <TouchableHighlight underlayColor={colors.shuttleGray20} onPress={this._doLogOut.bind(this)} style={{marginVertical:20,marginTop:70}}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </View>
      </TouchableHighlight>
    )
  }
}


const styles = StyleSheet.create({

  buttonText: {
    color: colors.white,
    alignSelf: 'flex-start',
    fontFamily: 'omnes',
  },
  button: {

    backgroundColor: 'transparent',
  }

});
