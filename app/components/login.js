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

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var Api = require("../utils/api");
var UserActions = require('../flux/actions/UserActions');


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
 phoneInput: {
   height: 50,
   padding: 4,
   fontSize: 23,
   borderWidth: 1,
   borderColor: 'white',
   borderRadius: 8,
   fontFamily:'omnes',
   color: 'white'
 },
 buttonText: {
   fontSize: 18,
   color: '#fff',
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
   borderColor: 'white',
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
       <TouchableHighlight
          style={styles.button}
          onPress={this.handleLogin.bind(this)}
          underlayColor="black">
          <Text style={styles.buttonText}> go </Text>
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

module.exports = Login;
