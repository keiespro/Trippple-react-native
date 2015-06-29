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
var TopTabs = require('../controls/topSignupSigninTabs');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


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
       <TopTabs active="register"/>
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
     </View>
   );
 }
}

module.exports = Register;
