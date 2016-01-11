/*
* @flow
*/


import React from 'react-native';
import DeviceConfig from '../DeviceConfig'
import { Component, View, Navigator, Dimensions } from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import alt from '../flux/alt';
import AltContainer from 'alt-container';

import Welcome from './welcome';
import Main from './main';
import PendingPartner from './pendingpartner';

import Onboarding from '../screens/registration/onboard'
import UserStore from '../flux/stores/UserStore';

import AppState from '../flux/stores/AppState';
import CredentialsStore from '../flux/stores/CredentialsStore'
import UserActions from '../flux/actions/UserActions';
import AppActions from '../flux/actions/AppActions';
import CheckMarkScreen from '../screens/CheckMark'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import NotificationActions from '../flux/actions/NotificationActions'
import {Connectivity, ReachabilitySubscription, AppVisibility} from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from '../components/LoadingOverlay'
import PurpleModal from '../modals/PurpleModal'

import colors from '../utils/colors'


class AppRoutes extends Component{

  constructor(props){
    super()
  }

  render(){
    var userStatus = this.props.user ? this.props.user.status : null;

    switch(userStatus){

      case 'verified':
        return <Onboarding
                key="OnboardingScreen"
                user={this.props.user}
                AppState={this.props.AppState}
                currentRoute={this.props.AppState.currentRoute}
              />
      case 'pendingpartner':
      case 'onboarded':
        return <Main
                key="MainScreen"
                user={this.props.user}
                AppState={this.props.AppState}
                currentRoute={this.props.AppState.currentRoute}
              />
      case null:
      default:
        return (<Welcome AppState={this.props.AppState} key={'welcomescene'} />)
      }
  }
}

class TopLevel extends Component{
  constructor(props){
    super()
    this.state = {
      showOverlay: props.user ? false : true,
      showCheckmark: false,
    }
  }

  componentWillReceiveProps(nProps){
    if(nProps && this.props.user && nProps.user &&  nProps.user.status == 'verified' && this.props.user.status != 'verified'){
      this.setState({showCheckmark:true,checkMarkCopy: {title: 'SUCCESS' }})
      this.setTimeout(()=>{
        this.setState({showCheckmark:false,checkMarkCopy:null})
      },3500);
    }
  }

  render(){
    return (
      <View style={{flex:1,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>

        <ReachabilitySubscription/>
        <AppVisibility/>

        <AppRoutes
          user={this.props.user}
          AppState={this.props.AppState}
          currentRoute={this.props.AppState.currentRoute}
        />

        {(this.state.showCheckmark || this.props.AppState.showCheckmark) ?
          <CheckMarkScreen
            key="toplevelcheckmark"
            isVisible={true}
            checkMarkCopy={this.state.checkMarkCopy || this.props.AppState.checkMarkCopy || ''}
            checkmarkRequireButtonPress={this.props.AppState.checkmarkRequireButtonPress || false}
          /> : <View/> }

        <LoadingOverlay key="LoadingOverlay" isVisible={this.props.AppState.showOverlay || this.state.showOverlay} />
        <Connectivity/>

        <Notifications user={this.props.user} AppState={this.props.AppState} />
      </View>
    )
  }
}


reactMixin(TopLevel.prototype, TimerMixin);



class App extends Component{
  constructor(props){
    super()
  }
  componentDidMount(){
    NotificationActions.resetBadgeNumber()
  }
  render(){
    var TopLevelStores = {
      user: (props) => {
        return {
          store: UserStore,
          value: UserStore.getState().user
        }
      },
      AppState: (props) => {
        return {
          store: AppState,
          value: AppState.getAppState()
        }
      },
    }

    return (
      <AltContainer stores={TopLevelStores}>
        <TopLevel />
      </AltContainer>
    );
  }

}

export default App
