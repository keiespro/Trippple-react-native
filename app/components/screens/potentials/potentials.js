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
import MatchesButton from './MatchesButtonIcon'

@withNavigation
class SettingsButton extends React.Component{
  render(){
    return (
      <TouchableOpacity style={{paddingTop:5,paddingRight:25,paddingBottom:5,}} onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Settings')) }>
        <Image
        tintColor={colors.white}
          resizeMode={Image.resizeMode.contain}
          style={{width:28,top:0,height:30,marginLeft:15,tintColor: __DEV__ ? colors.daisy : colors.white}}
          source={{uri:'assets/gear@3x.png'}}
        />
      </TouchableOpacity>
    )
  }
}


class Potentials extends React.Component{
  static route = {
    styles: {zIndex:-10,  position:'relative'},
    navigationBar: {
      visible: true,
      translucent:false,
      backgroundColor:colors.transparent,
      renderTitle(route, props){
        return route.params.show ? (
          <View style={{paddingTop:5}}>
            <Image
              resizeMode={Image.resizeMode.contain}
              style={{width:80,height:30,tintColor: __DEV__ ? colors.daisy : colors.white,alignSelf:'center'}}
              source={{uri:'assets/tripppleLogoText@3x.png'}}
            />
          </View>
        ) : false
      },
      renderLeft(route, props){
        return  route.params.show ? <SettingsButton  /> : (
          <TouchableOpacity
            onPress={()=>route.params.dispatch({type:'CLOSE_PROFILE'})}
            style={{padding:25,position:'absolute',top:12,zIndex:999}}
          >
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{width:15,height:15,marginTop:0,alignItems:'flex-start'}}
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
      profileVisible: props.ui.profileVisible,
      showPotentials: true,
    }
  }

  toggleProfile(){
    this.setState({profileVisible: !this.state.profileVisible})
  }


  componentDidMount(){


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
          backgroundColor: this.props.profileVisible ? colors.dark : colors.outerSpace,
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
             top: this.props.profileVisible ? 70 : 60,
             position:'relative',
           }]}>

           { potentials.length && this.state.showPotentials ?

            <CardStack
              user={user}
              dispatch={this.props.dispatch}
              rel={user.relationship_status}
              potentials={ potentials}
              navigator={this.props.navigator}
              profileVisible={this.props.profileVisible}
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
              navigation={this.props.navigation}
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
    ui: state.ui,
    profileVisible: state.ui.profileVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Potentials);
