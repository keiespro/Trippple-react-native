/* @flow */

import React, {
  Text,
  View,
  Image,
  Animated,
  ActivityIndicatorIOS,
  Dimensions,
  AppStateIOS,
  NativeModules
} from 'react-native';

import alt from '../flux/alt';
import Mixpanel from '../utils/mixpanel';
import AltContainer from 'alt-container';
import colors from '../utils/colors';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'
import PotentialsStore from '../flux/stores/PotentialsStore'
import MatchesStore from '../flux/stores/MatchesStore'
import PotentialsPlaceholder from './potentials/PotentialsPlaceholder'
import CardStack from './potentials/CardStack'
import styles from './potentials/styles'
import NotificationPermissions from '../modals/NotificationPermissions'
import MatchActions from '../flux/actions/MatchActions'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

class Potentials extends React.Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <AltContainer
       stores={{
            potentials: (props) => {
              return {
                store: PotentialsStore,
                value: PotentialsStore.getAll()
              }
            },
            unread: (props) => {
              return {
                store: MatchesStore,
                value: MatchesStore.getAnyUnread()
              }
        }}}>

          <PotentialsPage {...this.props}/>

      </AltContainer>
    )
  }
}


class PotentialsPage extends React.Component{
  constructor(props){
    super()
    this.state = {
      didShow: false,
      profileVisible: false,
      showPotentials: true,
      currentAppState: AppStateIOS.currentState
    }
  }
  toggleProfile(){
    this.setState({profileVisible: !this.state.profileVisible})
  }
  _handleAppStateChange(currentAppState){
    // console.log('currentAppState',currentAppState)
    if(currentAppState == 'active'){
      this.setState({  currentAppState, showPotentials: false});
      this.setTimeout(()=>{
        this.setState({ showPotentials: true});

      },1000);
    }else{
      this.setState({ profileVisible: false, currentAppState, showPotentials: false });

    }

  }
  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));

    if(this.props.user.status == 'onboarded'){
      MatchActions.getPotentials.defer();
      MatchActions.getMatches.defer();
      MatchActions.getFavorites.defer();
    }

    NativeModules.PushNotificationManager.checkPermissions((result)=>{
      var pushPermission = Object.keys(result).reduce( (acc,el,i) => {
        acc = acc + result[el];
        return acc
      },0)
      this.setState({hasPushPermission: (pushPermission > 0) })
    })
  }

  componentDidUpdate(){
    if(true == false && !this.state.hasPushPermission && !this.state.requestingPushPermission ){
      this.setState({requestingPushPermission:true})
      this.props.navigator.push({
        component: NotificationPermissions,
        passProps:{}
      })
    }

  }
  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));

  }
  getPotentialInfo(){

    if(!this.props.potentials[0]){ return false}
    var potential = this.props.potentials[0];
    var matchName = potential.user.firstname.trim();
    var distance = potential.user.distance;
    if(this.props.user.relationship_status == 'single') {
      matchName += ' & ' + potential.partner.firstname.trim();
      distance = Math.min(distance,potential.partner.distance);
    }
    return matchName
  }
  render(){
    const { potentials, user } = this.props
    const NavBar = React.cloneElement(this.props.pRoute.navigationBar, {
      ...this.props
    })
    return (
      <View
        style={{
          backgroundColor:this.state.profileVisible ? 'black' : colors.outerSpace,
          flex:1,
          width:DeviceWidth,
          height:DeviceHeight,
          top:0
        }}>

        {!this.state.profileVisible ? NavBar : null}

         <View style={[
           styles.cardStackContainer,
           {
             backgroundColor:this.state.profileVisible ? 'black' : 'transparent',
             position:'relative',
             top: 0//this.state.profileVisible ? 25 : 55
           }]}>

           { potentials.length && this.state.showPotentials ?

            <CardStack
              user={user}
              rel={user.relationship_status}
              potentials={ potentials}
              navigator={this.props.navigator}
              profileVisible={this.state.profileVisible}
              toggleProfile={this.toggleProfile.bind(this)}
            /> :

            null }


          {!this.state.didShow && potentials.length < 1 ?

            <View
              style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: DeviceHeight,
                width:DeviceWidth,
                position:'absolute',
                top:0,
                left:0
              }]}>
              <ActivityIndicatorIOS
                size={'large'}
                style={[{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 80,
                  top:-40
                }]}
                animating={true}
              />
            </View> : null
          }

          { potentials.length < 1 &&
            <PotentialsPlaceholder
              didShow={this.state.didShow}
              onDidShow={()=>{ this.setState({didShow:true});}}
            />
          }

        </View>
      </View>
    )
  }
}
reactMixin.onClass(PotentialsPage,TimerMixin)



export default Potentials;
