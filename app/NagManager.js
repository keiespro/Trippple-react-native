import { Settings, NativeModules, View, PushNotificationIOS, Platform } from 'react-native';
import React from 'react';

import Analytics from './utils/Analytics'
import SETTINGS_CONSTANTS from './utils/SettingsConstants'
import ActionMan from './actions/';
import OnboardModal from './components/modals/OnboardModal'
import { connect } from 'react-redux';
import PushNotification from 'react-native-push-notification'
import {pure} from 'recompose'
const iOS = Platform.OS == 'ios';
import OSPermissions from '../lib/OSPermissions/ospermissions'
import RNHotline from 'react-native-hotline'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'


function parseNotificationPermissions(nPermissions){
  return Object.keys(nPermissions).reduce((acc, el, i) => {
    acc = acc + nPermissions[el];
    return acc
  }, 0);
}

@pure
@reactMixin.decorate(TimerMixin)
class NagManager extends React.Component{

  constructor(props){
    super()
    this.state = {
      sawStarterPotentials: iOS ? Settings._settings.HAS_SEEN_STARTER_DECK : null,
      didOnboard: props.user && props.user.status && props.user.status == 'onboarded',
      np: true,
      lp: true
    }
  }
  componentDidMount(){
    if(iOS){
      PushNotificationIOS.checkPermissions(permissions => {
        const permResult = parseNotificationPermissions(permissions);
        this.setState({
          np: permResult,
        })


        const p = OSPermissions.canUseLocation()
            .then(OSLocation => {
              this.setState({
                lp: parseInt(OSLocation) > 2,
              })
            })
      })
    }
  }

  componentWillReceiveProps(nProps){
    if(!this.state.sawStarterPotentials && !this.props.loggedIn && nProps.loggedIn && !nProps.nag.sawStarterPotentials){
      // this.props.dispatch({type: 'GET_STARTER_POTENTIALS', payload: {relationshipStatus: this.props.user.relationship_status || 'single' }})
      this.setState({got_starter_pack: true})
      // Settings.set({HAS_SEEN_STARTER_DECK: true})
    }
    if(this.props.loggedIn && nProps.loggedIn){
    // relationship_status modal
      if(this.props.user.status == 'registered' && !this.state.askedOnboard && !this.props.user.relationship_status && !nProps.user.relationship_status){
        this.setState({askedOnboard: true})
        nProps.dispatch(ActionMan.showInModal({
          component: 'OnboardModal',
          passProps: {
            title: 'Onboard',
            dispatch: nProps.dispatch,
            navigator: nProps.navigator,
            navigation: nProps.navigation,
            user: nProps.user,
          }
        }))
      }

      if(!this.state.didOnboard && !this.props.user.relationship_status && nProps.user.relationship_status){
        this.setState({didOnboard: true})

        this.props.dispatch({type: 'SET_ASK_LOCATION', payload: {}})
        this.props.dispatch({type: 'SET_ASK_NOTIFICATION', payload: {}})
      }


      if(this.props.user.status == 'onboarded' && this.props.user.relationship_status){
        if(!this.props.nag.askNotification && !this.props.nag.askedNotification){
          this.props.dispatch({type: 'SET_ASK_NOTIFICATION', payload: {}})
        }
        if(!this.state.np && this.props.nag.askNotification && !this.props.nag.askedNotification && !nProps.nag.askedNotification){
          if(nProps.likeCount > this.props.likeCount){
            this.setState({askingNotification: true})
            this.notificationModal()
            this.props.dispatch({type: 'ASKED_NOTIFICATION', payload: {}})
          }
        }


        if(!this.props.nag.askLocation && !this.props.nag.askedLocation && !nProps.nag.askedLocation) {
          this.props.dispatch({type: 'SET_ASK_LOCATION', payload: {}})
        }
        if(!this.state.lp && this.props.nag.askLocation && !this.props.nag.askedLocation && !nProps.nag.askedLocation && !this.state.askingLocation) {
          this.setState({askingLocation: true})
          this.locationModal()
          this.props.dispatch({type: 'ASKED_LOCATION', payload: {}})
        }
      }
      //     // location permission modal
//       if(!this.props.nag.askedLocation && nProps.nag.askLocation && !this.state.askingLocation){
//         this.setState({askingLocation:true})
//         this.setTimeout(()=>{
//           this.locationModal();
//           this.props.dispatch({type:'ASKED_LOCATION', payload:{}})
//         },2000);
//       }


//       if(!this.props.nag.askedNotification && nProps.nag.askNotification && !this.state.askingNotification){
//         if( nProps.likeCount > this.props.likeCount){
//           this.setState({askingNotification:true})
//           PushNotification.checkPermissions((perm) =>{
//             if(!perm.alert){
//               this.setTimeout(()=>{
//                 this.notificationModal();
//                 this.props.dispatch({type:'ASKED_NOTIFICATION', payload:{}})
//               },1000);
//             }
//           })
//         }
//       }
    }
  }

  notificationModal(){
    this.props.dispatch(ActionMan.showInModal({
      component: 'NewNotificationPermissions',
      passProps: {
        title: 'N',
        successCallback: () => {
          this.setState({np: true})
        },
        user: this.props.user,
        cancel: () => { this.props.close() }
      }
    }))
  }

  locationModal(){
    this.setTimeout(() => {
      this.props.dispatch(ActionMan.showInModal({
        component: 'LocationPermissions',
        passProps: {
          title: 'Prioritze Local',
          user: this.props.user,
          failedTitle: 'Location',
          successCallback: (geo) => {
            this.setState({lp: true})
          },
          cancel: () => { this.props.close() }
        }
      }))
    }, 1000);
  }

  checkLocationSetting(){
    if(!this.props.permissions.location){
      this.locationModal()
    }else if(this.props.permissions.location){
      __DEV__ && console.log('have location permission, getting current location');

      this.props.dispatch(ActionMan.getLocation())
    }
  }

  render(){
    return <View/>
  }

}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  nag: state.nag,
  loggedIn: state.auth.api_key && state.auth.user_id,
  isNewUser: state.user.isNewUser,
  likeCount: state.likes.likeCount,
  permissions: state.permissions
})

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(NagManager);
