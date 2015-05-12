/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 PixelRatio,
 ScrollView,
 NavigatorIOS,
 Navigator
} = React;

var Api = require("../utils/api");
var Chat = require("./chat");



class NavButton extends React.Component {
  constructor(props){
    super(props);
   }
   onPress(){
     this.props.onPress(this.props.matchId)

   }
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.onPress.bind(this)}>
        <Text style={styles.navText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class MatchList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matches: []
    }
   }

   componentDidMount(){
    Api.getMatches()
     .then((res) => {
         console.log(res);
         this.setState({matches: res.response})

       })

     }


   handlePress(matchId){
     console.log(matchId);
     this.props.navigator.push({
       component: Chat,
       id:'chat',
       index: 3,
       title: 'CHAT',
       passProps:{
         index: 3,
         matchId: matchId
       }
     });

   }
  render() {
    console.log('renda')
    if(!this.state.matches){
      return (
        <View style={styles.container}>
        </View>
      )
    }
    var matchesList = this.state.matches.map((el,i) =>{
      console.log(el);
      if(!el.match_id) return;
      return (
        <NavButton key={el.match_id+'nav'} matchId={el.match_id} text={el.match_id} onPress={this.handlePress.bind(this)}></NavButton>
     )
    });
    return (
      <ScrollView>
        {matchesList}
      </ScrollView>
    );
  }
}



class Matches extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     matches: []
   }


  }




  render(){

    return (
      <MatchList
        style={styles.container} id={"matcheslist"} navigator={this.props.navigator} title={"matchlist"}>

      </MatchList>
   );
 }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
    padding: 0,
    paddingTop: 60
  },
  navText: {
    color:"#000000"
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    height:100,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
});

module.exports = Matches;
