/* @flow */

import React from "react";

import {Text, View, Image, Animated, ActivityIndicatorIOS, Dimensions, AppState, NativeModules} from "react-native";


import alt from '../flux/alt';
import Mixpanel from '../utils/mixpanel';
import AltContainer from 'alt-container/native';
import colors from '../utils/colors';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'
import PotentialsStore from '../flux/stores/PotentialsStore'
import MatchesStore from '../flux/stores/MatchesStore'
import PotentialsPlaceholder from './potentials/PotentialsPlaceholder'
import CardStack from './potentials/CardStack'
import styles from './potentials/styles'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import MatchActions from '../flux/actions/MatchActions'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'
import TaskManager  from '../TaskManager'

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
            potentialsMeta: (props) => {
              return {
                store: PotentialsStore,
                value: PotentialsStore.getMeta()
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
      currentAppState: AppState.currentState
    }
  }
  toggleProfile(){
    this.setState({profileVisible: !this.state.profileVisible})
  }
  _handleAppStateChange(currentAppState){

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
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

    if(this.props.user.status == 'onboarded'){
      MatchActions.getPotentials.defer(this.props.user.relationship_status);
      MatchActions.getMatches.defer();

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
    if( !this.state.hasPushPermission && !this.state.requestingPushPermission && this.props.potentialsMeta && this.props.potentialsMeta.relevantUser ){
      this.setState({requestingPushPermission:true})
      this.props.navigator.push({
        component: NotificationPermissions,
        passProps:{}
      })
    }


    if(this.props.potentials[1]){
      const potential = this.props.potentials[1]
      if(potential.user.image_url && potential.user.image_url.indexOf('http') >= 0){
        // Image.prefetch(potential.partner.thumb_url)
        Image.prefetch(potential.user.image_url)
      }
      if(potential.partner && potential.partner.image_url && potential.partner.image_url.indexOf('http') >= 0){
        // Image.prefetch(potential.partner.thumb_url)
        Image.prefetch(potential.partner.image_url)
      }
    }
    if(this.props.potentials[2]){
      const thirdpotential = this.props.potentials[2]
      if(thirdpotential.user.image_url && thirdpotential.user.image_url.indexOf('http') >= 0){
        // Image.prefetch(thirdpotential.user.thumb_url)
        Image.prefetch(thirdpotential.user.image_url)
      }
      if(thirdpotential.partner && thirdpotential.partner.image_url && thirdpotential.partner.image_url.indexOf('http') >= 0){

        // Image.prefetch(thirdpotential.partner.thumb_url)
        Image.prefetch(thirdpotential.partner.image_url)
      }
    }


  }
  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));

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
        <TaskManager navigator={this.props.navigator} user={user} triggers={this.props.potentialsMeta} />

        {!this.state.profileVisible ? NavBar : null}

         <View style={[
           styles.cardStackContainer,
           {
             backgroundColor:this.state.profileVisible ? 'black' : 'transparent',
             position:'relative',
             top: 50//this.state.profileVisible ? 25 : 55
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
              navigator={this.props.navigator}
              user={this.props.user}
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
