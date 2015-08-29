/*
* @flow
*/


import React from 'react-native';

import { Component, View, Navigator } from 'react-native';

import alt from '../flux/alt';
import AltContainer from 'alt/AltNativeContainer';

import Welcome from './welcome';
import Main from './main';
import PendingPartner from './pendingpartner';

import Onboard from '../screens/registration/onboard'

import UserStore from '../flux/stores/UserStore';
import CredentialsStore from '../flux/stores/CredentialsStore'
import UserActions from '../flux/actions/UserActions';
import AppActions from '../flux/actions/AppActions';

import NotificationsStore from '../flux/stores/NotificationsStore';
import NotificationCommander from '../utils/NotificationCommander';
import LoadingOverlay from '../components/LoadingOverlay'

class AppRoutes extends Component{

  constructor(props){
    super()

  }
  componentDidMount(){
    AppActions.initApp()
  }
  render(){
    var userStatus = this.props.user ? this.props.user.status : null;

    switch(userStatus){

      case 'verified':
        return <Onboard key="OnboardingScreen" user={this.props.user}/>

      case 'pendingpartner':
        return <PendingPartner key="PendingPartnerScreen" user={this.props.user}/>

      case 'onboarded':
        return <Main key="MainScreen" user={this.props.user}/>

      case null:
      default:
        return <Welcome  key={'welcomescene'} />
      }
  }
}

class TopLevel extends Component{
  constructor(props){
    super(props)
    this.state = {
      showOverlay: this.props.user ? false : true
    }
  }
  componentDidMount(){
  }
  render(){
    return (
      <View style={{flex:1}}>

          <AppRoutes user={this.props.user}/>

          <AltContainer store={CredentialsStore}>
            <NotificationCommander user={this.props.user}/>
          </AltContainer>

          <LoadingOverlay key="LoadingOverlay" isVisible={this.state.showOverlay} />

      </View>
    )
  }
}



class App extends Component{

  render(){
    return (
      <AltContainer store={UserStore}>
        <TopLevel />
      </AltContainer>
    );
  }

}

export default App
