/*
* @providesModule Trippple
* @flow
*/

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Navigator
} = React;


var Login = require('./app/components/login');
var Main = require('./app/components/main');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 10
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


class Trippple extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      userStatus: null,
      apikey: null,
      userId: null
    }
  }
  _performLogin(userInfo){
    console.log('userInfo',userInfo);
    this.setState({ userStatus: "onboarded", userId: userInfo.user_id, apikey: userInfo.api_key})
    this.push({component:Main,index:1})

  }
  renderScene(route, navigator){
    console.log('renderscene',route)
    switch(this.state.userStatus){
        case "onboarded":
          return (<Main  route={route} navigator={navigator}  key={'mainscene'} userId={this.state.userId} />)
        case null:
        default:
          return (<Login route={route} navigator={navigator} key={'loginscene'} performLogin={this._performLogin.bind(this)}/>)
      }

  }

  render(){
    return (
      <Navigator
        initialRoute={{
          component: Login,
          name:"login",
          index:0
        }}
        key={'topnav'}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }

}

module.exports = Trippple;

AppRegistry.registerComponent('Trippple', () => Trippple);
