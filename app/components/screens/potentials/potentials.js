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


const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const ToolbarLogo = () => (
  <View style={{paddingTop: 0}}>
    <Image
      resizeMode={Image.resizeMode.contain}
      style={{
        width: 80,
        height: 40,
        tintColor: __DEV__ ? colors.daisy : colors.white,
        alignSelf: 'center'
      }}
      source={require('./assets/tripppleLogoText@3x.png')}
    />
  </View>
)

const CloseProfile = ({route}) => (
  <TouchableOpacity
    onPress={() => route.params.dispatch({type: 'CLOSE_PROFILE'})}
    style={{
      padding: 15,
      left: -5,
      width: 45,
      height: 45,
      position: 'absolute',
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    }}
  >
    <Image
      resizeMode={Image.resizeMode.contain}
      style={{
        width: 15,
        height: 15,
        alignSelf: 'center'
      }}
      source={require('./assets/close@3x.png')}
    />
  </TouchableOpacity>
)

const Toolbar = () => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: iOS ? 64 : 50,
      position: 'absolute',
      top: 0,
      flexGrow: 1,
      margin: 0,
      alignSelf: 'stretch',
      width: DeviceWidth,
      alignItems: 'flex-end',
      zIndex: 900,
    }}
  >
    <SettingsButton />
    <ToolbarLogo />
    <MatchesButton />
  </View>
)

@withNavigation
class Potentials extends React.Component{
  static route = {
    styles: NavigationStyles.Fade,
    statusBar: {
      translucent: true
    },
    sceneStyle: {
      backgroundColor: colors.outerSpace,
    },
    navigationBar: {
      visible: false, // iOS,
      style: {height: 0},
      // translucent: true,
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
    this.checkIfNoLocationPermission()
    if(!this.props.user || !this.props.user.id){
      this.props.navigator.replace('Welcome')

    }else if(this.props.user && this.props.user.status != 'onboarded'){
      console.log(this.props.user);
      this.props.navigator.replace('Onboard')
    }else{
      if(this.props.permissions.location && this.props.permissions.location == 'authorized'){
        this.props.dispatch(ActionMan.getLocation());
      }
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
      this.ba.remove()
    }
    if(!this.props.loggedIn && nProps.loggedIn){
      // this.props.dispatch(ActionMan.getPotentials())
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
    return true

  }
  checkIfNoLocationPermission(){
    if(this.props.permissions.location == 'undetermined'){
      this.props.dispatch(ActionMan.showInModal({
        component:'LocationPermissions',
        passProps:{

        }
      }))
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
          backgroundColor: colors.outerSpace,
          flexGrow: 1,
        }}

      >

        <View
          style={[
            styles.cardStackContainer,
            {
              top: 0,
              position: 'absolute',
              flexGrow: 1,
            }
          ]}
          pointerEvents={'box-none'}
        >

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
            /> :
            <PotentialsPlaceholder
              navigator={this.props.navigator}
              navigation={this.props.navigation}
              user={this.props.user}
              didShow={this.state.didShow}
              onDidShow={() => { this.setState({didShow: true}); }}
            />
          }

          <Toolbar />

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
  loggedIn: state.auth.api_key && state.auth.user_id
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Potentials);
