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
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
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


   _handlePress(matchId){
     console.log(matchId);
     this.props.navigator.push({
       index: 1,
       component: Chat,
       title:'chat',
       passProps: {
         matchId: matchId,
         shouldUpdate:true
       },
     })
   }
  render() {
    if(!this.state.matches){
      return (
        <View style={styles.container}>
        </View>
      )
    }
    var matchesList = this.state.matches.map((el,i) =>{
      return (
        <NavButton key={el.match_id+'nav'} text={el.match_id} onPress={(evt) => this._handlePress(el.match_id)}></NavButton>
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



  }


  renderScene(route,navigator){
    switch (route.id) {
      case 'chat':
        return <Chat navigator={navigator} shouldUpdate={true} />;
      case 'matcheslist':
      default:
        return <MatchList matches={this.state.matches} navigator={navigator} />;
    }
  }

  render(){

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{index:0, id: 'matcheslist', component: MatchList, title:'matchlist'}}

        renderScene={this.renderScene.bind(this)}>

      </NavigatorIOS>
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
