/* @flow */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput
} = React;

var colors = require('../utils/colors')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var Api = require("../utils/api");
var UserActions = require('../flux/actions/UserActions');

var Facebook = require('./facebook');


var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:20

  },
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 50,
    alignSelf: 'stretch'
  },
  phoneInput: {
    height: 50,
    padding: 4,
    fontSize: 21,
    fontFamily:'Montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    fontFamily:'Montserrat',

  },

  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});


class Login extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      phone: '3055282534',
      password: 'lopeh',
      isLoading: false
    }
  }

  handlePhoneChange(event: any){
    this.setState({
      phone: event.nativeEvent.text
    })
  }

  handlePasswordChange(event: any){
    this.setState({
      password: event.nativeEvent.text
    })
  }

  handleLogin(){
    UserActions.login(this.state.phone,this.state.password)
  }
  handleBack(){
    this.props.navigator.pop();
  }
  render(){
    return (
      <View style={styles.container}>

        <View style={styles.phoneInputWrap}>
          <TextInput
            style={styles.phoneInput}
            value={this.state.phone || ''}
            keyboardType={'phone-pad'}
            placeholder={'Phone'}
            keyboardAppearance={'dark'}
            placeholderTextColor='#fff'
            onChange={this.handlePhoneChange.bind(this)}
            />
        </View>

        <View style={styles.middleTextWrap}>
          <Text style={styles.middleText}>OR</Text>
        </View>

        <Facebook/>

      </View>
    );
  }
}

module.exports = Login;
