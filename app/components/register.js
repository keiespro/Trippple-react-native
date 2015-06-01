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

var UserActions  = require('../flux/actions/UserActions');
var RegisterActions = require('../flux/actions/RegisterActions');
var RegisterStore= require('../flux/stores/RegisterStore');

var styles = StyleSheet.create({
 error: {
   color: 'red'
 },
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
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   marginTop: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
 },
});

class Register extends React.Component{

 constructor(props){
   super(props);
   this.state = RegisterStore.getState();
 }

 componentDidMount () {
  RegisterStore.listen(this.onChange.bind(this));
 }

 componentWillUnmount () {
  RegisterStore.unlisten(this.onChange.bind(this));
 }

 handleSubmit(){
   UserActions.register(this.state.phone,this.state.password,this.state.password2)
 }

 onChange(newState) {
   this.setState(newState);
 }

 handleBack(){
   this.props.navigator.pop();
 }

 render(){
   return (
       <View style={styles.container}>
         { this.state.error && <Text style={styles.error}>{this.state.error.message}</Text> }
         <TextInput
           style={[styles.phoneInput, (this.state.error && {color: "red"})]}
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

+function setUpFieldHandlers () {

 [
   "Phone"
 , "Password"
 , "Password2"
 ].forEach( name =>
     Object.defineProperty(Register.prototype
                         , `handle${name}Change`
                         , mkDescriptor(name))
    );

 function mkDescriptor (name) {
    return {
      value: function (event) {
        RegisterActions.onFieldChange(name.toLowerCase(), event.nativeEvent.text);
      }
    };
  }
}();


module.exports = Register;
