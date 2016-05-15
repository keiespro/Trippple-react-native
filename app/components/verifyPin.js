import React from "react";
import {StyleSheet, Text, View, TextInput, TouchableHighlight} from "react-native";

import UserActions from '../flux/actions/UserActions'


class VerifyPin extends Component{

  constructor(props){
    super(props);
    this.state = {
      pin: {
        0: '',
        1: '',
        2: '',
        3: ''
      },
      pinNumber: ''
    }
  }
  handlePinChange(value){
    value = value.slice(0,4);


      this.setState({
        pinNumber: value,
        pin:{
          0: value[0],
          1: value[1],
          2: value[2],
          3: value[3]
        }
      })

  }
  componentDidUpdate(){

    if(this.state.pinNumber.length >= 4){
      var value = this.state.pinNumber.slice(0,4);
      UserActions.verifySecurityPin(value, this.props.user.phone);
    }
  }
  render() {
    // var val = this.state.pin.toArray();

    return (
      <View style={styles.container}>
          <Text style={[styles.textplain]}>VERIFY PIN</Text>

          <TextInput
            style={styles.hiddenInput}
            value={this.state.pinNumber}
            autoFocus={true}
            keyboardType={'number-pad'}
            onChangeText={this.handlePinChange.bind(this)}
          />
          <View style={styles.row}>
            <View style={styles.singleInput}>
              <Text style={[styles.textplain]}>{this.state.pin[0]}</Text>
            </View>
            <View style={styles.singleInput}>
              <Text style={[styles.textplain]}>{this.state.pin[1]}</Text>
            </View>
            <View style={styles.singleInput}>
              <Text style={[styles.textplain]}>{this.state.pin[2]}</Text>
            </View>
            <View style={styles.singleInput}>
              <Text style={[styles.textplain]}>{this.state.pin[3]}</Text>
            </View>
          </View>

      </View>
    );
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39365c',
  },
  textplain:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  hiddenInput: {
    opacity: 0.1
  },
  row:{
    flexDirection: 'row',
    height: 100,
    width: undefined,
    left: 0,
    right: 0,
    alignSelf: 'stretch',
    justifyContent: 'space-around'
  },
  singleInput:{
    width: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 80,
    backgroundColor: 'white',

  }
});


export default VerifyPin;
