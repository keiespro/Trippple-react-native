import { StatusBar, View, Dimensions,Modal } from 'react-native';
import React from "react";
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import colors from '../utils/colors'
import ActionMan from '../actions/';
import ChatOverlay from '../ChatOverlay';

import NagManager from '../NagManager'
import DeepLinkHandler from '../utils/DeepLinkHandler'
import { connect } from 'react-redux';
import '../fire'
import { withNavigation} from '@exponent/ex-navigation';
import pure from 'recompose/pure'

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

    if(!this.state.initialized && !this.props.loggedIn && nProps.loggedIn){
      this.setState({initialized:true})

      this.performInitActions()
    }
    //
    // if(!this.props.nag.sawStarterPotentials && this.state.initialized && !this.state.got_starter_pack && this.props.user.relationship_status){
    //   this.props.dispatch({type: 'GET_STARTER_POTENTIALS', payload: {relationshipStatus: this.props.user.relationship_status }})
    //   this.setState({got_starter_pack:true})
    // }

  }


  render(){
    return (
      <View style={{}}>

        <StatusBar animated={true} barStyle="default" />

        <ConnectionInfo dispatch={this.props.dispatch}/>

        <AppState dispatch={this.props.dispatch}/>

        {this.props.nag && <NagManager/>}

        <DeepLinkHandler />

        { this.props.loggedIn ?  <AppNav/> : <Welcome dispatch={this.props.dispatch}/> }

        <ModalDirector />

        <Notifications dispatch={this.props.dispatch} />

        {/* {this.props.ui.chat && <ChatOverlay dispatch={this.props.dispatch} navigationState={{routes:[{route:{}}],index:0}} scene={{index:1}} layout={{width:DeviceWidth,height:DeviceHeight}} matchInfo={this.props.ui.matchInfo} match_id={this.props.ui.chat.match_id} />} */}
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
    ui: {...state.ui, matchInfo: state.matches[state.ui.chat ? state.ui.chat.match_id : null]},
    loggedIn: state.auth.api_key && state.auth.user_id,
    push_token: state.device.push_token,
    exnavigation: state.exnavigation
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(pure(App));
