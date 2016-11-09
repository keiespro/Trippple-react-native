import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {pure} from 'recompose'
import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'
import ActionMan from './actions/';


@pure
@reactMixin.decorate(TimerMixin)
class NagManager extends React.Component{

  constructor(props){
    super()
    this.state = {
      didOnboard: props.user && props.user.status && props.user.status == 'onboarded',
      np: true,
      lp: true
    }
  }

  componentDidMount(){
    if(this.props.user.status && !this.props.user.relationship_status ){

      this.onboardModal()
    }

    if(this.props.loggedIn){
    // relationship_status modal

      if(!this.state.didOnboard && !this.props.user.relationship_status ){
        // this.setState({didOnboard: true})

        this.props.dispatch({type: 'SET_ASK_LOCATION', payload: {}})
      }


      if(this.props.user.status == 'onboarded' && this.props.user.relationship_status){

        if(!this.props.permissions.location && !this.props.nag.askLocation && !this.props.nag.askedLocation ) {
          this.props.dispatch({type: 'SET_ASK_LOCATION', payload: {}})
        }
        if(!this.state.lp && this.props.nag.askLocation && !this.props.nag.askedLocation && !this.state.askingLocation) {
          // this.setState({askingLocation: true})
          this.locationModal()
          this.props.dispatch({type: 'ASKED_LOCATION', payload: {}})
        }
      }

      if(!this.props.permissions.location){
        this.props.dispatch({type: 'SET_ASK_LOCATION', payload: {}})
      }

    }
  }


  onboardModal(){
    this.setState({askedOnboard: true})
    this.props.dispatch(ActionMan.showInModal({
      component: 'OnboardModal',
      passProps: {
        title: 'Onboard',
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
