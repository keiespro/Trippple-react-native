/*
* @flow
*/



import React from 'react-native';
import { View, Navigator } from 'react-native';

import alt from '../flux/alt';
import AltContainer from 'alt/AltNativeContainer';

import Welcome from './welcome';
import Main from './main';
import FBLogin from './fb.login';
import PendingPartner from './pendingpartner';

import Onboard from '../screens/registration/onboard';

import UserStore from '../flux/stores/UserStore';
import UserActions from '../flux/actions/UserActions';

import NotificationsStore from '../flux/stores/NotificationsStore';
import NotificationCommander from '../utils/NotificationCommander';

class Routes extends React.Component{

  constructor(props){
    super(props)

  }

  render(){
    console.log(this.props.user)
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
          // <Main key="MainScreen" user={this.props.user}/>
          // <Josue user={this.props.user} />
          // <FBLogin user={this.props.user} />
          <FBLogin user={this.props.user} />
        )

      case null:
      default:
        return (
          <Welcome  key={'welcomescene'} />
        )
      }
  }
}

class TopLevel extends React.Component{
  constructor(props){
    super(props)

  }
  componentDidMount(){
    UserActions.initialize()
  }
  render(){
    console.log(this.props)
    return (
      <View>
        <NotificationCommander {...this.props} user={this.props.user}/>
        <Routes {...this.props} />
      </View>
    )
  }
}



class App extends React.Component{

  render(){
    return (
      <AltContainer store={UserStore}>
        <TopLevel />
      </AltContainer>
    );
  }

}

export default App
