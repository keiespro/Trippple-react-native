import React from "react";
import {AppRegistry, View, Navigator, Dimensions, Image, NativeModules,Settings,Linking} from "react-native";
import Analytics from '../utils/Analytics'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import Welcome from './welcome/welcome';
import Main from './main';
import ModalDirector from '../modals/ModalDirector'
// import CheckMarkScreen from '../screens/CheckMark'
// import TimerMixin from 'react-timer-mixin';
// import reactMixin from 'react-mixin'
import {Connectivity, ReachabilitySubscription, AppVisibility} from '../utils/ConnectionInfo'
import Notifications from '../utils/Notifications';
import LoadingOverlay from './LoadingOverlay'
import MaintenanceScreen from '../screens/MaintenanceScreen'
import colors from '../utils/colors'
import url from 'url'



import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {getUserInfo} from  '../reducers/actions';
import loadSavedCredentials from '../../Credentials'



class App extends React.Component{
  constructor(props){
    super()

    this.state = {
      loading: true,
      overlaid: true,

    }

  }

  componentDidMount(){

    loadSavedCredentials().then(creds => {
      this.props.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})
      this.props.dispatch(getUserInfo(creds))
    })



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
  }

  render(){
    const user = this.props.userInfo || {}
    return (
      <View style={{flex:10,backgroundColor:colors.outerSpace, width:DeviceWidth,height:DeviceHeight}}>

        <ReachabilitySubscription/>
        <AppVisibility/>
        {!this.state.loading && <Connectivity/>}

        {this.props.userInfo && this.props.userInfo.id ? (
          <Main
            key="MainScreen"
            user={user}
            AppState={this.props.AppState}
            currentRoute={{}}
          />
        ) : <Welcome AppState={this.props.AppState} key={'welcomescene'} />
        }


        <ModalDirector
          user={user}
        />

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
  return { ...state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
