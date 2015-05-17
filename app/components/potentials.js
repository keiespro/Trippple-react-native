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
   backgroundColor: '#fff',
   padding: 10,
   overflow:'hidden',
   borderColor:'#fff',
   borderWidth:1,
   borderRadius:5
 }
});
class Potentials extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     potentials: null
   }
 }


 render(){
   return (
     <View style={styles.container}>
       <Text>Potentials</Text>
     </View>
   );
 }
}

module.exports = Potentials;
