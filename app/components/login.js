/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput
} = React;


var Api = require("../utils/api");
var UserActions = require('../flux/actions/UserActions');


var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#6A85B1',
   padding: 10
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
