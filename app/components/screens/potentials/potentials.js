import { View, ActivityIndicator, StatusBar, Dimensions, BackAndroid, Platform, NativeModules, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import MatchesButton from './MatchesButtonIcon'
import SettingsButton from './SettingsButton'
import CardStack from './CardStack';
import PotentialsPlaceholder from './PotentialsPlaceholder';
import colors from '../../../utils/colors';
import styles from './styles';
import _ from 'lodash'
import ActionMan from '../../../actions'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation'
import Router from '../../../Router'
import Toolbar from './Toolbar'
import {pure,onlyUpdateForKeys} from 'recompose'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;



class Potentials extends React.Component{
  static route = {
    styles: NavigationStyles.Fade,
    statusBar: {
      translucent: false
    },
    sceneStyle: {
      backgroundColor: colors.outerSpace,
    },
    navigationBar: {
      visible: false, // iOS,
      style: {height: 0},
      translucent: true,
      // backgroundColor: colors.transparent,
      height: 0,
      width: 0
    }
  };

  constructor(){
    super()
    this.state = {
      didShow: false,
      showPotentials: true,
    }
  }
  componentDidMount(){
    this.props.dispatch({type:'LOADING_FULFILLED'})
    if(!this.props.loggedIn || (this.props.loadedUser && !this.props.user.id)){
      this.props.navigator.immediatelyResetStack([Router.getRoute('Welcome')], 0)

    }else{
    }

  }

  componentWillUnmount(){
    if(this.ba){
      this.ba.remove()
    }
  }
  componentWillReceiveProps(nProps){

    const nui = nProps.ui;
    const ui = this.props.ui;
    if(nui.profileVisible && !ui.profileVisible){
      this.ba = BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid.bind(this))
    }else if(!nui.profileVisible && this.ba){

    }

    if(!this.props.loggedIn && nProps.loggedIn && nProps.user.status == 'onboarded'){
      this.props.dispatch(ActionMan.getPotentials())
    }
    if(this.props.user.status != 'onboarded' && nProps.user.status == 'onboarded'){
      this.props.dispatch(ActionMan.getPotentials())
    }

   if(!this.props.loadedUser && nProps.loadedUser && nProps.user.status && nProps.user.status != 'onboarded'){
      this.props.dispatch(ActionMan.resetRoute('Onboard'))

    }
    if(!this.state.askedLocation && nProps.user.status == 'onboarded' ){
      this.checkIfNoLocationPermission()

    }
  }

  handleBackAndroid(){

    if(this.props.profileVisible){
      this.props.dispatch({ type: 'CLOSE_PROFILE' });

      return true
    }else{
      // this.props.navigator.pop()

      // return false

    }

  }
  checkIfNoLocationPermission(){
    let ask, get;
    this.setState({
      askedLocation:true
    })
    const locperm = this.props.permissions.location;
    if(locperm != 'soft-denied'){
      if(iOS){
        if(locperm == 'undetermined'){
          ask = true
        }else if(locperm == 'authorized'){
          get = true
        }
      }else{
        if(locperm){
          get = true
        }else{
          ask = true
        }
      }
    }
    if(ask){
      this.props.dispatch(ActionMan.showInModal({
        component:'LocationPermissions',
        passProps:{
        }
      }))
    }
    if(get){
      this.props.dispatch(ActionMan.getLocation());
    }
  }

  getPotentialInfo(){
    if(!this.props.potentials || !this.props.potentials.length){ return false }
    const potential = this.props.potentials[0];
    let matchName = potential.user.firstname.trim();
    // let distance = potential.user.distance;
    if(potential.partner && potential.partner.gender) {
      matchName += ` & ${potential.partner.firstname.trim()}`;
      // distance = Math.min(distance, potential.partner.distance);
    }
    return matchName
  }

  toggleProfile(){
    this.props.profileVisible ? this.props.dispatch({ type: 'CLOSE_PROFILE' }) : this.props.dispatch({ type: 'OPEN_PROFILE' });
  }

  render(){
    const { potentials, user } = this.props

    return (
      <View
        style={{
          top: 0,
          bottom:0,
          position:'absolute',
          left:0,right:0,
          alignItems:'stretch',
            backgroundColor: colors.outerSpace,
          flexGrow: 1,height:DeviceHeight,width:DeviceWidth
        }}
      >

        <View
          style={[
            styles.cardStackContainer,
            {
              top: 0,
              bottom:0,
              left:0,right:0,
              position: 'absolute',
              flexGrow: 1,
            }
          ]}
          pointerEvents={'box-none'}
        >
          <PotentialsPlaceholder
            navigator={this.props.navigator}
            navigation={this.props.navigation}
            user={this.props.user}
            hasPotentials={potentials.length > 1}
            didShow={this.state.didShow}
            onDidShow={() => { this.setState({didShow: true}); }}
          />

          { potentials.length && this.state.showPotentials ?
            <CardStack
              user={user}
              rel={this.props.user.relationship_status}
              dispatch={this.props.dispatch}
              potentials={potentials}
              drawerOpen={this.props.drawerOpen}
              navigator={this.props.navigator}
              profileVisible={this.props.profileVisible}
              toggleProfile={this.toggleProfile.bind(this)}

            />
           : null}

          <Toolbar dispatch={this.props.dispatch} key={'ts'}/>






</View>

      </View>
    )
  }
}

Potentials.displayName = 'Potentials'

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  potentials: _.reject(state.potentials, p => state.swipeQueue[p.user.id] != null),
  unread: state.unread,
  ui: state.ui,
  profileVisible: state.ui.profileVisible,
  drawerOpen: state.ui.drawerOpen,
  permissions: state.permissions,
  loadedUser: state.ui.loadedUser,
  loggedIn: state.auth.api_key && state.auth.user_id
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Potentials);
