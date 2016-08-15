/*
* @flow
*/


import React from "react";

import DeviceConfig from '../DeviceConfig'
import {Component} from "react";
import {AppRegistry, View, Navigator, Dimensions, Image, NativeModules,Settings,Linking} from "react-native";
import Analytics from '../utils/Analytics'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import alt from '../flux/alt';
import AltContainer from 'alt-container/native';
import Welcome from './welcome/welcome';
import Main from './main';
import ModalDirector from '../modals/ModalDirector'
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
import LoadingOverlay from './LoadingOverlay'
import PurpleModal from '../modals/PurpleModal'
import MaintenanceScreen from '../screens/MaintenanceScreen'
import colors from '../utils/colors'
import ImageFlagged from '../screens/ImageFlagged'
import url from 'url'



class TopLevel extends Component{
  constructor(props){
    super()
    this.state = {
      loading: true,
      overlaid: true,
      authStatus: !!props.user.status
    }

  }
  componentDidMount(){
    if(!this.props.user.status == 'onboarded'){
      Linking.addEventListener('url', this.handleCoupleDeepLink.bind(this))
    }

    this.setTimeout(()=>{
      this.setState({
        overlaid: false,
        loading:false
      })
    },2000)
  }

  handleCoupleDeepLink(event){
    const deeplink = url.parse(event.url);

    Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})

    if(deeplink.host == 'join.couple'){
      const pin = deeplink.path.substring(1,deeplink.path.length);
      Settings.set({'co.trippple.deeplinkCouplePin': pin});
    }
  }
  componentWillReceiveProps(nProps){
    if(this.state.authStatus != nProps.user.status){
      this.setState({authStatus: !!nProps.user.status})
    }

    // if(nProps && this.props.user && nProps.user && nProps.user.status == 'onboarded' && this.props.user.status != 'onboarded'){
    //   Linking.removeEventListener('url', this.handleCoupleDeepLink.bind(this))
    // }
  }

  render(){
    const user = this.props.user || {}
    return (
      <View style={{flex:10,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>

        <ReachabilitySubscription/>
        <AppVisibility/>
        {!this.state.loading && <Connectivity/>}

        {this.state.authStatus ? (
          <Main
            key="MainScreen"
            user={this.props.user}
            AppState={this.props.AppState}
            currentRoute={this.props.AppState.currentRoute}
          />
        ) : <Welcome AppState={this.props.AppState} key={'welcomescene'} />
        }


        <ModalDirector
          user={user}
          AppState={this.props.AppState}
        />

        {(this.state.showCheckmark || this.props.AppState.showCheckmark) ?
          <CheckMarkScreen
            key="toplevelcheckmark"
            isVisible={true}
            checkMarkCopy={this.state.checkMarkCopy || this.props.AppState.checkMarkCopy || ''}
            checkmarkRequireButtonPress={this.props.AppState.checkmarkRequireButtonPress || false}
          /> : <View/> }

        <Notifications user={this.props.user} AppState={this.props.AppState} />

        {this.props.AppState.showMaintenanceScreen ? <MaintenanceScreen /> : null }

        {this.state.overlaid  && <LoadingOverlay />}

      </View>
    )
  }
}

TopLevel.displayName = 'TopLevel'


reactMixin(TopLevel.prototype, TimerMixin);



class App extends Component{
  constructor(props){
    super()
  }
  componentDidMount(){
    NotificationActions.resetBadgeNumber()
  }
  render(){
    const TopLevelStores = {
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
//
App.displayName = 'App'



module.exports = App
