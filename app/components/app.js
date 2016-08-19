import { StatusBar, View, Dimensions, Settings } from 'react-native';
import React from "react";

import AppNavigation from './AppNavigation';
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';

import Analytics from '../utils/Analytics'
import {Connectivity, ReachabilitySubscription, AppVisibility} from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import colors from '../utils/colors'
import url from 'url'

import {persistStore} from 'redux-persist'
import ActionMan from  '../actions/';



import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class App extends React.Component{
  constructor(props){
    super()

    this.state = {
      loading: true,
      overlaid: true,

    }

  }

  performInitActions(){

    const initActions = [
      'getUserInfo',
      'getPotentials',
      'getMatches',
      'getNewMatches',
      'getPushToken',
    ];

    initActions.forEach(ac => {
      this.props.dispatch(ActionMan[ac]())
    })
  }



  componentDidMount(){




    // if(!this.props.user.status == 'onboarded'){
    //   Linking.addEventListener('url', this.handleCoupleDeepLink.bind(this))
    // }

    // this.setTimeout(()=>{
    //   this.setState({
    //     overlaid: false,
    //     loading:false
    //   })
    // },2000)
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

    //
    // if(this.state.authStatus != nProps.user.status){
    //   this.setState({authStatus: !!nProps.user.status})
    // }

    // if(nProps && this.props.user && nProps.user && nProps.user.status == 'onboarded' && this.props.user.status != 'onboarded'){
    //   Linking.removeEventListener('url', this.handleCoupleDeepLink.bind(this))
    // }

    if(!this.props.loggedIn && nProps.loggedIn){
      this.performInitActions()
    }
  }

  render(){
    const user = this.props.user || {}
    return (
      <View style={{flex:10,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>
      <StatusBar animated={true} barStyle="default" />

      <ReachabilitySubscription/>
      <AppVisibility/>
      {!this.state.loading && <Connectivity/>}
      {/*
        {user && user.id ? (
        <Main
        key="MainScreen"
        user={user}
        AppState={this.props.AppState}
        currentRoute={{}}
        />
      ) : <Welcome AppState={this.props.AppState} key={'welcomescene'} />
    } */}

    {this.props.loggedIn ? ( <AppNav/> ) : <Welcome dispatch={this.props.dispatch} key={'welcomescene'} /> }

    {/* <ModalDirector
    user={user}
    /> */}

    {/* {(this.state.showCheckmark || this.props.AppState.showCheckmark) ?
      <CheckMarkScreen
      key="toplevelcheckmark"
      isVisible={true}
      checkMarkCopy={this.state.checkMarkCopy || this.props.AppState.checkMarkCopy || ''}
      checkmarkRequireButtonPress={this.props.AppState.checkmarkRequireButtonPress || false}
      /> : <View/> } */}

      <Notifications user={user} AppState={this.props.AppState} />

      {/* {this.props.AppState.showMaintenanceScreen ? <MaintenanceScreen /> : null } */}

      {/* {this.state.overlaid  && <LoadingOverlay />} */}

      </View>
    )
  }
}


// reactMixin(App.prototype, TimerMixin);

const mapStateToProps = (state, ownProps) => {
  // console.log('state',state,'ownProps',ownProps); // state
  return {
    user: state.user,
    fbUser: state.fbUser,
    auth: state.auth,
    loggedIn: state.auth.api_key && state.auth.user_id
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
