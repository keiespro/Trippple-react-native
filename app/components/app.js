/*
* @flow
*/


import React from 'react-native';

import { Component, View, Navigator } from 'react-native';

import alt from '../flux/alt';
import AltContainer from 'alt/AltNativeContainer';

import Welcome from './welcome';
import Main from './main';
import FBLogin from './fb.login';
import PendingPartner from './pendingpartner';

import Onboard from '../screens/registration/onboard'
import UserStore from '../flux/stores/UserStore';

import AppState from '../flux/stores/AppState';
import CredentialsStore from '../flux/stores/CredentialsStore'
import UserActions from '../flux/actions/UserActions';
import AppActions from '../flux/actions/AppActions';
import CheckMarkScreen from '../screens/CheckMark'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'

import Notifications from '../utils/Notifications';
import LoadingOverlay from '../components/LoadingOverlay'
import PurpleModal from './PurpleModal'


@reactMixin.decorate(TimerMixin)
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
        return <Onboard
                key="OnboardingScreen"
                user={this.props.user}
                currentRoute={this.props.currentRoute}
                />

      case 'pendingpartner':
        return <PendingPartner
                key="PendingPartnerScreen"
                user={this.props.user}
                currentRoute={this.props.currentRoute}
                />

      case 'onboarded':
        return <Main
                key="MainScreen"
                user={this.props.user}
                currentRoute={this.props.currentRoute}
                />
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
      showOverlay: this.props.user ? false : true,
      showCheckmark: false,
      showPurpleModal: false
    }
  }
  // componentDidUpdate(prevProps,prevState){
  //   console.log(prevProps.user,this.props.user);
  //   if((this.props.showCheckMark) && this.props.user.status == "verified"){

  //     this.setState({showCheckmark:true})

  //     this.setTimeout(()=>{
  //       console.log('time')
  //       this.setState({showCheckmark:false})
  //     },5000);
  //   }
  // }

  render(){
    return (
      <View style={{flex:1,backgroundColor:'#000000'}}>

        <AppRoutes user={this.props.user} currentRoute={this.props.currentRoute}/>

        {this.props.showCheckmark &&
          <CheckMarkScreen
            key="toplevelcheckmark"
            isVisible={this.props.showCheckmark}
            checkMarkCopy={this.props.checkMarkCopy}
            checkmarkRequireButtonPress={this.props.checkmarkRequireButtonPress}
          />
        }

        <LoadingOverlay key="LoadingOverlay" isVisible={this.props.showOverlay || this.state.showOverlay} />

        <Notifications user={this.props.user} />

      </View>
    )
  }
}



class App extends Component{

  render(){
    var TopLevelStores = {
      user: (props) => {
        return {
          store: UserStore,
          value: UserStore.getState().user
        }
      },
      currentRoute: (props) => {
        console.log('ALT',props)
        return {
          store: AppState,
          value: AppState.getAppState()
        }
      }
    }

    return (
      <AltContainer stores={TopLevelStores}>
        <TopLevel />
      </AltContainer>
    );
  }

}

export default App
