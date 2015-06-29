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

var UserActions = require('../flux/actions/UserActions');

var Facebook = require('./facebook');
var TopTabs = require('../controls/topSignupSigninTabs');


var styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  wrap: {
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

  render(){
    return (

      <View style={styles.wrap}>

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

class Register extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      phone: '',
      password: '',
      password2: '',
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

  handlePassword2Change(event: any){
    this.setState({
      password2: event.nativeEvent.text
    })
  }

  handleSubmit(){
    UserActions.register(this.state.phone,this.state.password,this.state.password2)
  }

  handleBack(){
    this.props.handleBack();
  }
  render(){
    return (
      <View style={styles.wrap}>
        <TextInput
          style={styles.phoneInput}
          value={this.state.phone || ''}
          keyboardType={'number-pad'}
          placeholder={'Phone'}
          placeholderTextColor='#fff'
          onChange={this.handlePhoneChange.bind(this)}
          />
        <TextInput
          style={styles.phoneInput}
          value={this.state.password || ''}
          password={true}
          keyboardType={'default'}
          autoCapitalize={'none'}
          placeholder={'Password'}
          placeholderTextColor='#fff'
          onChange={this.handlePasswordChange.bind(this)}
          />
        <TextInput
          style={styles.phoneInput}
          value={this.state.password2 || ''}
          password={true}
          keyboardType={'default'}
          autoCapitalize={'none'}
          placeholder={'Confirm Password'}
          placeholderTextColor='#fff'
          onChange={this.handlePassword2Change.bind(this)}
          />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="black">
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleBack.bind(this)}
          underlayColor="black">
          <Text style={styles.buttonText}>Back</Text>
        </TouchableHighlight>
      </View>

    );
  }
}




class Auth extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab: props.initialTab
    }
  }

  handleBack(){
    this.props.navigator.pop();
  }
  toggleTab(newTab){
    console.log(newTab)
    if(newTab == this.state.activeTab) return;
    this.setState({
      activeTab:newTab
    })
  }
  render(){
    var activeTab = () => {
      switch(this.state.activeTab){
        case 'login':
          return ( <Login handleBack={this.handleBack.bind(this)} /> );
        case 'register':
          return ( <Register handleBack={this.handleBack.bind(this)} /> );
      }

    }
    return (
      <View style={styles.container}>
        <TopTabs toggleTab={this.toggleTab.bind(this)} active={this.state.activeTab}/>
        { activeTab() }
      </View>
    );
  }
}



module.exports = Auth;
