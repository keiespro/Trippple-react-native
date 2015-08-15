/*
* @flow
*/

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  NavigatorIOS,
  TextInput,
  Navigator
} = React;

var alt = require('../flux/alt');
var AltContainer = require('alt/AltNativeContainer');

var Welcome = require('./welcome');
var Main = require('./main');
var PendingPartner = require('./pendingpartner');
var VerifyPin = require('./verifyPin');
var Onboard = require('../screens/registration/onboard');

var UserStore = require('../flux/stores/UserStore');
var UserActions = require('../flux/actions/UserActions');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'red',
    overflow:'hidden',
    alignSelf:'stretch',
    flexDirection:'row'
  },
  wrapper: {
    backgroundColor: 'pink',
    alignSelf:'stretch'

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

  }

  componentDidMount(){
    UserActions.initialize();
  }

  _renderScene (route, navigator){
    return (<route.component {...route.passProps} key={route.id} user={this.props.user} navigator={navigator}/>);
  }

  render(){

    var userStatus = this.props.user ? this.props.user.status : null;

    switch(userStatus){
      //
      // case "registered":
      //   return (
      //     <VerifyPin key="VerifyPinScreen" user={this.props.user}/>
      //   )

      case "verified":
        return (
          <Onboard key="OnboardingScreen" user={this.props.user}/>
        )

      case "pendingpartner":
        return (
          <PendingPartner key="PendingPartnerScreen" user={this.props.user}/>
        )

      case "onboarded":
        return (
          <Main key="MainScreen" user={this.props.user}/>
        )

      case null:
      default:
        return (
          <Welcome  key={'welcomescene'} />
        )
      }
  }
}

class App extends React.Component{

  render(){
    return (
      <AltContainer
          stores={{
            user: function (props) {
              return {
                store: UserStore,
                value: UserStore.getUser()
              }
            }
          }}>
          <TopLevel key={'lvlvl'}/>
      </AltContainer>
    );
  }

}

module.exports = App;
