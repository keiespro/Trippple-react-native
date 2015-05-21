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


var UserActions = require('../flux/actions/UserActions');


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
         onChange={this.handlePhoneChange.bind(this)}
       />
       <TextInput
         style={styles.phoneInput}
         value={this.state.password || ''}
         password={true}
         keyboardType={'default'}
         autoCapitalize={'none'}
         onChange={this.handlePasswordChange.bind(this)}
       />
       <TextInput
         style={styles.phoneInput}
         value={this.state.password2 || ''}
         password={true}
         keyboardType={'default'}
         autoCapitalize={'none'}
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
