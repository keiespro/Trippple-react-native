/* @flow */

import {
  View,
  ActivityIndicator,
  Dimensions,
  AppState,
  NativeModules,
  TouchableOpacity,
  Image
} from 'react-native';
import React from "react";

import CardStack from './CardStack';
import PotentialsPlaceholder from './PotentialsPlaceholder';
import colors from '../../../utils/colors';
import styles from './styles';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import ActionMan from '../../../actions/'
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

@withNavigation
class SettingsButton extends React.Component{
  render(){
     return (
      <TouchableOpacity onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Settings')) }>
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:28,top:0,height:30,marginLeft:15,tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/gear@3x.png'}}
        />
      </TouchableOpacity>
    )
  }
}


@withNavigation
class MatchesButton extends React.Component{
  render(){
    return (
      <TouchableOpacity onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Matches'))}>
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:28,top:0,height:30,marginRight:15,tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/chat@3x.png'}}
        />
      </TouchableOpacity>
    )
  }
}


class Potentials extends React.Component{
  static route = {
    styles: {zIndex:-10, height:0,position:'relative'},
    navigationBar: {
      visible: true,
      backgroundColor:colors.outerSpace,
      renderTitle(route, props){
        return route.params.show ? (
          <View><Image
            resizeMode={Image.resizeMode.contain}
            style={{width:80,height:30,tintColor: __DEV__ ? colors.daisy : colors.white,alignSelf:'center'}}
            source={{uri:'assets/tripppleLogoText@3x.png'}}
          /></View>
        ) : false
      },
      renderLeft(route, props){
        return  route.params.show ? <SettingsButton  /> : (
          <TouchableOpacity style={{position:'absolute'}} onPress={()=>route.params.dispatch({type:'CLOSE_PROFILE'})}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={{width:20,height:20,margin:15,alignItems:'flex-start'}}
              source={{uri: 'assets/close@3x.png'}}
            />
          </TouchableOpacity>
        )
      },
      renderRight(route, props){
        return  route.params.show ? <MatchesButton /> : false
      }
    }
  };

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
  // _handleAppStateChange(currentAppState){
  //
  //   if(currentAppState == 'active'){
  //     this.setState({  currentAppState, showPotentials: false});
  //     this.setTimeout(()=>{
  //       this.setState({ showPotentials: true});
  //
  //     },1000);
  //   }else{
  //     this.setState({ profileVisible: false, currentAppState, showPotentials: false });
  //
  //   }
  //
  // }
  componentDidMount(){
    // AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    // this.props.navigator.showLocalAlert('Hello!', {
    //   text: {color: '#fff'},
    //   container: {backgroundColor: 'red'}
    // });

    if(this.props.user.status){

    }

    NativeModules.PushNotificationManager.checkPermissions((result)=>{
      var pushPermission = Object.keys(result).reduce( (acc,el,i) => {
        acc = acc + result[el];
        return acc
      },0)
      this.setState({hasPushPermission: (pushPermission > 0) })
    })
  }

  componentWillReceiveProps(nProps){
    console.log(nProps);
    const nui = nProps.ui;
    const ui = this.props.ui;
    if( !nui.profileVisible && ui.profileVisible){
      this.setState({profileVisible: false})

      this.props.navigator.updateCurrentRouteParams({
        visible: false,show:true,dispatch: this.props.dispatch,backgroundColor:'black'
      })
    }else{
      if(  nui.profileVisible && !ui.profileVisible){
        this.props.navigator.updateCurrentRouteParams({show: false, visible: false, dispatch: this.props.dispatch })
      }

    }
  }

  componentDidUpdate(){
    // if( !this.state.hasPushPermission && !this.state.requestingPushPermission && this.props.potentialsMeta && this.props.potentialsMeta.relevantUser ){
    //   this.setState({requestingPushPermission:true})
    //   this.props.navigator.push({
    //     component: NotificationPermissions,
    //     passProps:{}
    //   })
    // }

    //
    // if(this.props.potentials && this.props.potentials[1]){
    //   const potential = this.props.potentials[1]
    //   if(potential.user.image_url && potential.user.image_url.indexOf('http') >= 0){
    //     // Image.prefetch(potential.user.image_url)
    //   }
    //   if(potential.partner && potential.partner.image_url && potential.partner.image_url.indexOf('http') >= 0){
    //     // Image.prefetch(potential.partner.image_url)
    //   }
    // }
    // if(this.props.potentials && this.props.potentials[2]){
    //   const thirdpotential = this.props.potentials[2]
    //   if(thirdpotential.user.image_url && thirdpotential.user.image_url.indexOf('http') >= 0){
    //     // Image.prefetch(thirdpotential.user.image_url)
    //   }
    //   if(thirdpotential.partner && thirdpotential.partner.image_url && thirdpotential.partner.image_url.indexOf('http') >= 0){
    //     // Image.prefetch(thirdpotential.partner.image_url)
    //   }
    // }
  }
  componentWillUnmount(){
    // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));

  }
  getPotentialInfo(){

    if(!this.props.potentials || !this.props.potentials.length){ return false}


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

    return (
      <View
        style={{
          backgroundColor: this.state.profileVisible ? colors.dark : colors.outerSpace,
          width:DeviceWidth,
          height:DeviceHeight,
          zIndex:9999,
          top:-64,

          position:'relative',
        }}>
        {/* {!global.__TEST__ && <TaskManager navigator={this.props.navigator} user={user} triggers={this.props.potentialsMeta} />} */}


         <View style={[
           styles.cardStackContainer,
           {
             top: this.props.ui.profileVisible ? 70 : 60,
             position:'relative',
           }]}>

           { potentials.length && this.state.showPotentials ?

            <CardStack
              user={user}
              dispatch={this.props.dispatch}
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
              <ActivityIndicator
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

          { !potentials || (potentials && potentials.length < 1) &&
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
// reactMixin.onClass(Potentials,TimerMixin)
Potentials.displayName = "Potentials"

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    potentials: state.potentials,
    unread: state.unread,
    ui: state.ui
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Potentials);
