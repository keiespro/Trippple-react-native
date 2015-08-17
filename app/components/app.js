/*
* @flow
*/



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

var Onboard = require('../screens/registration/onboard');

var UserStore = require('../flux/stores/UserStore');
var UserActions = require('../flux/actions/UserActions');

import NotificationsStore from '../flux/stores/NotificationsStore'

class TopLevel extends React.Component{

  constructor(props){
    super()

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

      case 'verified':
        return (
          <Onboard key="OnboardingScreen" user={this.props.user}/>
        )

      case 'pendingpartner':
        return (
          <PendingPartner key="PendingPartnerScreen" user={this.props.user}/>
        )

      case 'onboarded':
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
