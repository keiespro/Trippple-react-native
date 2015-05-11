/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 ScrollView,
} = React;

var Api = require("../utils/api");


// class NavButton extends React.Component {
//   render() {
//     return (
//       <TouchableHighlight
//         underlayColor="#B5B5B5"
//         onPress={this.props.onPress}>
//         <Text >{this.props.text}</Text>
//       </TouchableHighlight>
//     );
//   }
// }

var styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#ff0000',
   padding: 10
 }
});


class Matches extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     matches: null
   }
 }

 componentDidMount(){
   console.log('didmount');
  //  Api.getMatches()
  //   .then((res) => {
  //       console.log(res);
  //       this.setState({matches: res.response})
  //     })

 }


 render(){
   console.log("x")
  // if(!this.state.matches){
  //   return (
  //   <ScrollView style={styles.container}>
  //   </ScrollView>
  //   )
  // }
  //  var matchesList = this.state.matches.map((el,i) =>{
  //    return (
  //      <NavButton text={el.firstname} onPress={(e)=>{console.log(e)}}/>
  //    )
  //  });
   return (
     <View style={styles.container}>
     </View>
   );
 }
}

module.exports = Matches;
