import { StatusBar, View, Dimensions, Modal, Platform } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation} from '@exponent/ex-navigation';
import SplashScreen from 'react-native-splash-screen'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import RC from '../RemoteConfig'
import _ from 'lodash'
import pure from 'recompose/pure'
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import colors from '../utils/colors'
import Analytics from '../utils/Analytics'
import ActionMan from '../actions/';
import Onboard from './Onboard'
import DeepLinkHandler from '../utils/DeepLinkHandler'
import '../fire'

const iOS = Platform.OS == 'ios';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

@reactMixin.decorate(TimerMixin)
class App extends React.Component{
  constructor(){
    super()

    this.state = {
      loading: true
    }
  }

  componentDidMount(){
    this.setTimeout(() => {
      SplashScreen.hide();
      this.props.dispatch(ActionMan.setHotlineUser(this.props.user))
      this.performInitActions()
      Analytics.identifyUser(this.props.user)


    }, 1000)
  }

  componentWillReceiveProps(nProps){
    if(nProps.user && nProps.user.id && nProps.loggedIn){
      if(!this.props.booted && nProps.booted){
        __DEV__ && console.info('init');
        this.initialize(nProps)
      }
      if(this.state.initialized && this.props.appState != 'active' && nProps.appState == 'active'){
        SplashScreen.hide();
      }
      if(this.state.initialized && this.props.loggedIn && !nProps.savedCredentials){
        this.props.dispatch(ActionMan.saveCredentials())
      }
    }
  }

  componentDidUpdate(pProps, pState){
    if(this.state.initialized && !pState.initialized){
      SplashScreen.hide();
      this.props.dispatch(ActionMan.setHotlineUser(this.props.user))
      this.performInitActions()
      Analytics.identifyUser(this.props.user)

    }
  }

  initialize(nProps){
    if(!this.state.initialized){
      this.setState({initialized: true})
    }
  }

  performInitActions(){

    const initActions = [
      'getUserInfo',
      'getPotentials',
      'getMatches',
      'getNewMatches',
        // 'getNotificationCount',
    ];
    const {permissions} = this.props;

    if(permissions.location){
      initActions.push('getLocation')
    }
    if(permissions.notifications){
      initActions.push('getPushToken')
    }
    RC.getValue('init_actions')
        .then(actions => {

          __DEV__ && console.log('init_actions', actions);
          _.reject(actions.split(','), a => a == 'getLocation').forEach(ac => {
            this.props.dispatch(ActionMan[ac]())
          })
        })
        .catch(err => {
          __DEV__ && console.log('init_actions error', err);

          initActions.forEach(ac => {
            this.props.dispatch(ActionMan[ac]())
          })
        })

  }


  render(){
    return (
      <View style={{width: DeviceWidth, height: DeviceHeight}}>

        <ConnectionInfo dispatch={this.props.dispatch}/>

        <AppState dispatch={this.props.dispatch}/>

        {/* {this.props.nag && <NagManager/>} */}

        {iOS && <DeepLinkHandler />}

        { this.props.onboarded ? <AppNav/> :
            this.props.loggedIn ? <Onboard user={this.props.user} permissions={this.props.permissions}/> :
              <Welcome dispatch={this.props.dispatch}/>
        }

        <ModalDirector />

        <Notifications />

      </View>
      )
  }
}

const mapStateToProps = (state, ownProps) => {
  const loggedIn = state.auth.api_key && state.auth.user_id;
  const onboarded = state.user.relationship_status && state.permissions.notifications && state.permissions.location;

  return {
    ...ownProps,
    onboarded: loggedIn && onboarded,
    user: state.user,
    fbUser: state.fbUser,
    auth: state.auth,
    ui: {...state.ui, matchInfo: state.matches[state.ui.chat ? state.ui.chat.match_id : null]},
    loggedIn,
    push_token: state.device.push_token,
    exnavigation: state.exnavigation,
    savedCredentials: state.auth.savedCredentials,
    appState: state.app.appState,
    booted: state.app.booted,
    permissions: state.permissions
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((App));
