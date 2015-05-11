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


var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#000000',
   padding: 10
 },
 phoneInput: {
   height: 50,
   padding: 4,
   fontSize: 23,
   borderWidth: 1,
   borderColor: 'white',
   borderRadius: 8,
   color: 'white'
 },
 buttonText: {
   fontSize: 18,
   color: '#111',
   alignSelf: 'center'
 },
 button: {
   height: 45,
   flexDirection: 'row',
   backgroundColor: 'white',
   borderColor: 'white',
   borderWidth: 1,
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

 handlePhoneChange(event){
   this.setState({
     phone: event.nativeEvent.text
   })
 }

 handlePasswordChange(event){
   this.setState({
     password: event.nativeEvent.text
   })
 }

 handleLogin(){
   Api.login(this.state.phone,this.state.password)
     .then((res) => {
         console.log(res, this.props.navigator);
         this.props.performLogin(res.response);
       })
 }

 render(){
   return (
     <View style={styles.container}>
       <TextInput
         style={styles.phoneInput}
         value={this.state.phone || ''}
         keyboardType={'number-pad'}
         onChange={this.handlePhoneChange.bind(this)}
       />
       <TextInput
         style={styles.phoneInput}
         value={this.state.password || ''}
         password={true}
         keyboardType={'default'}
         onChange={this.handlePasswordChange.bind(this)}
       />
       <TouchableHighlight
          style={styles.button}
          onPress={this.handleLogin.bind(this)}
          underlayColor="black">
          <Text style={styles.buttonText}> go </Text>
       </TouchableHighlight>
     </View>
   );
 }
}

module.exports = Login;
