import { StatusBar, View, Dimensions } from 'react-native';
import React from "react";
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import colors from '../utils/colors'
import ActionMan from  '../actions/';
import NagManager from '../NagManager'
import DeepLinkHandler from '../utils/DeepLinkHandler'
import { connect } from 'react-redux';
import '../fire'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


class App extends React.Component{
  constructor(props){
    super()

    this.state = {
      loading: true
    }
  }

  performInitActions(){

    const initActions = [
      // 'getPushToken',
      'getNotificationCount',
      'getUserInfo',
      'getPotentials',
      'getMatches',
      'getNewMatches',
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
    loggedIn: state.auth.api_key && state.auth.user_id,
    push_token: state.device.push_token
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
