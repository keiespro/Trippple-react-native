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
  AsyncStorage,
  View,
  TouchableHighlight,
  TextInput,
  Navigator
} = React;

var alt = require('./app/flux/alt');
var Login = require('./app/components/login');
var Main = require('./app/components/main');
var UserStore = require('./app/flux/stores/UserStore');

var AltContainer = require('alt/AltNativeContainer');

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


class TopLevel extends React.Component{

  constructor(props){
    super(props);
    // this.state = {
    //   userStatus: null,
    //   apikey: null,
    //   userId: null
    // }
  }


  renderScene(route, navigator){
    console.log('renderscene',this.state,this.props)
    var userStatus = this.props.User ? this.props.User.status : null;
    switch(userStatus){
        case "onboarded":
          return (<Main route={route} navigator={navigator}  key={'mainscene'} user={this.props.User} />)
        case null:
        default:
          return (<Login route={route} navigator={navigator} key={'loginscene'} />)
      }

  }
  render(){
    return(
      <Navigator
        initialRoute={{
          component: Login,
          name:"login",
          index:0
        }}
        key={'topnav'}
        renderScene={this.renderScene.bind(this)}
      />
    )
  }
}

class Trippple extends React.Component{

  render(){
    return (
      <AltContainer
          stores={{
            User: function (props) {
              return {
                store: UserStore,
                value: UserStore.getUser()
              }
            }
          }}>
          <TopLevel/>
      </AltContainer>
    );
  }

}

module.exports = Trippple;

AppRegistry.registerComponent('Trippple', () => Trippple);
