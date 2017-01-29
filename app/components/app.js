import { StatusBar, View, Dimensions, NativeModules, Text, Platform, ActivityIndicator } from 'react-native';
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
import LikeSender from '../LikeSender'

const iOS = Platform.OS == 'ios';
const {RNUXCam} = NativeModules
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

  componentWillMount(){
    if(this.props.loggedIn) this.props.dispatch(ActionMan.getUserInfo());

  }

  componentDidMount(){

    this.setTimeout(() => {
      SplashScreen.hide();

      this.performInitActions()
      if(this.props.user){
        this.props.dispatch(ActionMan.setHotlineUser(this.props.user))
        Analytics.identifyUser(this.props.user)
      }else{

      }

    }, 1000)
  }

  componentWillReceiveProps(nProps){
    if(nProps.user && nProps.user.id && nProps.loggedIn){
      if(!this.props.booted && nProps.booted){

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

    if(permissions.location && permissions.location == 'authorized'){
      initActions.push('getLocation')
    }
    // if(permissions.notifications){
    //   initActions.push('getPushToken')
    // }
    RC.getValue('init_actions')
        .then(actions => {
          __DEV__ && console.log('init_actions', actions);
          // _.reject(actions.split(','), a => a == 'getLocation').forEach(ac => {

          actions.split(',').forEach(ac => {
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
      <View style={{width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace}}>

        <ConnectionInfo dispatch={this.props.dispatch}/>
        {this.props.loadedUser && this.props.user && this.props.loggedIn && <LikeSender />}

        <AppState dispatch={this.props.dispatch}/>

        {iOS && <DeepLinkHandler />}
          <AppNav initialRoute={this.props.loggedIn ? this.props.onboarded ? 'Potentials' : 'Onboard' : 'Welcome'}/>
        {!this.props.loadedUser || this.props.loggingIn && <Loading /> }
        <ModalDirector />

        <Notifications />

      </View>
      )
  }
}

const Loading = () => (
<View
  style={{justifyContent:'center',alignItems:'center',flexGrow:1,position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight,backgroundColor:colors.outerSpace}}>
  <ActivityIndicator
            size="large"
            color={colors.white}
            animating={true}
            style={{}} />
  </View>
)
const mapStateToProps = (state, ownProps) => {
  const loggedIn = state.auth.api_key && state.auth.user_id;
  const onboarded = state.user.relationship_status && state.permissions.notifications && state.permissions.notifications != 'undetermined' && state.permissions.location && state.permissions.location != 'undetermined';

  return {
    ...ownProps,
    onboarded: onboarded,
    user: state.user,
    fbUser: state.fbUser,
    auth: state.auth,
    ui: {...state.ui, matchInfo: state.matches[state.ui.chat ? state.ui.chat.match_id : null]},
    loggedIn,
    loadedUser: state.ui.loadedUser,
    push_token: state.device.push_token,
    exnavigation: state.exnavigation,
    savedCredentials: state.auth.savedCredentials,
    appState: state.app.appState,
    booted: state.app.booted,
    permissions: state.permissions,
    loggingIn: state.ui.loggingIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((App));
