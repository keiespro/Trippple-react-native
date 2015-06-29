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

var colors = require('../utils/colors')

var UserActions = require('../flux/actions/UserActions');


var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: colors.outerSpace,
   padding: 10
 },
 phoneInput: {
   height: 50,
   padding: 4,
   fontSize: 23,
   borderWidth: 1,
   borderColor: colors.white,
   borderRadius: 8,
   fontFamily:'omnes',
   color: colors.white
 },
 buttonText: {
   fontSize: 18,
   color: colors.white,
   alignSelf: 'center',
   fontFamily:'omnes'

 },
 button: {
   height: 45,
   flexDirection: 'row',
   backgroundColor: 'transparent',
   borderColor: colors.white,
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

module.exports = Register;
