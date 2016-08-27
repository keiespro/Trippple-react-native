import { StatusBar, View, Dimensions, Settings } from 'react-native';
import React from "react";

import AppNavigation from './AppNavigation';
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';

import Analytics from '../utils/Analytics'
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import colors from '../utils/colors'

import {persistStore} from 'redux-persist'
import ActionMan from  '../actions/';

import NagManager from '../NagManager'
import DeepLinkHandler from '../utils/DeepLinkHandler'
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
      // '',
      'getNotificationCount',
      'getUserInfo',
      'getPotentials',
      'getMatches',
      'getNewMatches',
      'getPushToken',
      'checkLocation'
    ];

    initActions.forEach(ac => {
      this.props.dispatch(ActionMan[ac]())
    })
  }



  componentDidMount(){


  }

  componentWillReceiveProps(nProps){

    if(!this.props.loggedIn && nProps.loggedIn){
      this.performInitActions()
    }
  }

  render(){
    const user = this.props.user || {}
    return (
      <View style={{flex:10,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>

        <StatusBar animated={true} barStyle="default" />

        <ConnectionInfo dispatch={this.props.dispatch}/>

        <AppState dispatch={this.props.dispatch}/>

        {this.props.nag && <NagManager/>}

        <DeepLinkHandler />

        {this.props.loggedIn ?
          <AppNav/> : <Welcome dispatch={this.props.dispatch} key={'welcomescene'} />
        }

        <ModalDirector />

        {this.props.loggedIn &&
          <Notifications dispatch={this.props.dispatch} />
        }
      </View>
    )
  }
}


// reactMixin(App.prototype, TimerMixin);

const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    nag: state.nag,
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
