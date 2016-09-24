import { StatusBar, View, Dimensions,Modal,PushNotificationIOS } from 'react-native';
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

    componentDidMount(){
        PushNotificationIOS.checkPermissions((permissions) => {
            const permResult = Object.keys(permissions).reduce((acc,el,i) =>{
                acc = acc + permissions[el];
                return acc
            },0);

            if(permResult){
                PushNotificationIOS.addEventListener('register', (push_token) =>{
                    __DEV__ && console.warn( 'TOKEN:', push_token );
                    if(push_token){
                        this.props.dispatch({type:'SAVE_PUSH_TOKEN', payload: push_token})
                    }else{
                        this.props.dispatch({type:'SAVE_PUSH_TOKEN_FAILED', payload: null})
                    }
                })

                PushNotificationIOS.addEventListener('registrationError', (err) =>{
                    __DEV__ && console.warn( 'TOKEN registrationError:', err );
                });
                // PushNotificationIOS.requestPermissions({alert:true,badge:true,sound:true})

            }else{
            // this.props.dispatch({type:'NO', payload: push_token})
            }
        })
    }

    componentWillReceiveProps(nProps){

        if(!this.state.initialized && nProps.loggedIn){
            this.setState({initialized:true})

            this.performInitActions()
        }
        if(this.state.initialized && nProps.loggedIn && this.props.appState != 'active' && nProps.appState == 'active'){
            this.performInitActions()
        }

    }


    render(){
        return (
      <View style={{}}>

          <StatusBar animated={true} barStyle="default" />

          <ConnectionInfo dispatch={this.props.dispatch}/>

          <AppState dispatch={this.props.dispatch}/>

          {this.props.nag && <NagManager/>}

          <DeepLinkHandler />

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
        appState: state.app.appState
    }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((App));
