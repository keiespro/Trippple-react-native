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





var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#ff0000',
   padding: 10
 }
});
class Settings extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     userId: 2
   }
 }


 render(){
   return (
     <View style={styles.container}>
       <Text>Settings</Text>
     </View>
   );
 }
}

module.exports = Settings;
