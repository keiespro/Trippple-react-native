import { StatusBar, View, Dimensions,Modal,Platform } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { withNavigation} from '@exponent/ex-navigation';
import pure from 'recompose/pure'
import AppNav from '../AppNav';
import ModalDirector from './modals/ModalDirector';
import Welcome from './screens/welcome/welcome';
import AppState from '../utils/AppState'
import ConnectionInfo from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import colors from '../utils/colors'
import Analytics from '../utils/Analytics'
import ActionMan from '../actions/';
import NagManager from '../NagManager'
import DeepLinkHandler from '../utils/DeepLinkHandler'
import '../fire'
const iOS = Platform.OS == 'ios';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class App extends React.Component{
    constructor(props){
        super()

        this.state = {
          loading: true
        }
    }

    componentDidMount(){

    }

    performInitActions(){

        const initActions = [
            'getNotificationCount',
            'getUserInfo',
            'getPotentials',
            'getMatches',
            'getNewMatches',
            'checkLocation',
            'getPushToken'
        ];

        initActions.forEach(ac => {
            this.props.dispatch(ActionMan[ac]())
        })

    }


    componentWillReceiveProps(nProps){

        if(!this.state.initialized && nProps.user && nProps.loggedIn){
            this.setState({initialized:true})
            nProps.dispatch(ActionMan.setHotlineUser(nProps.user))
            this.performInitActions()
            console.warn('xxxxx',nProps.user);
            Analytics.identifyUser(nProps.user)

        }
        if(this.state.initialized && nProps.loggedIn && this.props.appState != 'active' && nProps.appState == 'active'){
            this.performInitActions()
        }
        if(this.state.initialized && this.props.loggedIn && nProps.loggedIn && !nProps.savedCredentials){
          this.props.dispatch(ActionMan.saveCredentials())

        }

    }


    render(){
        return (
          <View style={{width:DeviceWidth,height:DeviceHeight}}>

            <StatusBar animated={true} barStyle="default" />

            <ConnectionInfo dispatch={this.props.dispatch}/>

            <AppState dispatch={this.props.dispatch}/>

            {this.props.nag && <NagManager/>}

            {iOS && <DeepLinkHandler />}

            { this.props.loggedIn ? <AppNav/> : <Welcome dispatch={this.props.dispatch}/> }

            <ModalDirector />

            <Notifications />

        </View>
      )
    }
}

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
        exnavigation: state.exnavigation,
        savedCredentials: state.auth.savedCredentials,
        appState: state.app.appState
    }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((App));
