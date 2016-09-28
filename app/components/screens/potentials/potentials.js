import {
  View,
  ActivityIndicator,
  Dimensions,
  AppState,
  Platform,
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
import {pure} from 'recompose'
const iOS = Platform.OS == 'iOS';

@withNavigation
class SettingsButton extends React.Component{
    render(){
        return (
            <TouchableOpacity
              style={{paddingTop:5,paddingRight:25,paddingBottom:5,}}
              onPress={() => this.props.navigator.push(this.props.navigation.router.getRoute('Settings')) }
            >
              <Image
            tintColor={colors.white}
            resizeMode={Image.resizeMode.contain}
            style={{width:28,top:0,height:30,marginLeft:15,tintColor: __DEV__ ? colors.mandy : colors.white}}
            source={{uri:'assets/gear@3x.png'}}
        />
      </TouchableOpacity>
    )
    }
}

class Potentials extends React.Component{
    static route = {
        styles: {zIndex:-10, position:'relative',elevation:-5},
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
                return route.params.show ? <SettingsButton /> : (
                  <TouchableOpacity
                      onPress={()=>route.params.dispatch({type:'CLOSE_PROFILE'})}
                      style={{padding:15,left:-5,width:45,height:45,position:'absolute',top:0,
                       alignItems:'center',justifyContent:'center',zIndex:999}}
                  >
                  <Image
                      resizeMode={Image.resizeMode.contain}
                      style={{width:15,height:15,alignSelf:'center'}}
                      source={{uri: 'assets/close@3x.png'}}
                  />
                </TouchableOpacity>
                      )
            },
            renderRight(route, props){
                return route.params.show ? <MatchesButton /> : false
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

        iOS && NativeModules.PushNotificationManager.checkPermissions((result)=>{
            let pushPermission = Object.keys(result).reduce( (acc,el,i) => {
                acc = acc + result[el];
                return acc
            },0)
            this.setState({hasPushPermission: (pushPermission > 0) })
        })
    }

    componentWillReceiveProps(nProps){
        const nui = nProps.ui;
        const ui = this.props.ui;
        if( !nui.profileVisible && ui.profileVisible){
            this.setState({profileVisible: false})

            this.props.navigator.updateCurrentRouteParams({
                visible: false,show:true,dispatch: this.props.dispatch,backgroundColor:'black'
            })
        }else{
            if( nui.profileVisible && !ui.profileVisible){
                this.props.navigator.updateCurrentRouteParams({show: false, visible: false, dispatch: this.props.dispatch })
            }

        }
    }

    getPotentialInfo(){

        if(!this.props.potentials || !this.props.potentials.length){ return false}


        let potential = this.props.potentials[0];
        let matchName = potential.user.firstname.trim();
        let distance = potential.user.distance;
        if(potential.partner && potential.partner.gender) {
            matchName += ' & ' + potential.partner.firstname.trim();
            distance = Math.min(distance,potential.partner.distance);
        }
        return matchName
    }
    // shouldComponentUpdate(nP,nS){
    //     if(!nP.potentials[0] || !this.props.potentials[0]) return true;
    //     return nP.potentials[0].user.id != this.props.potentials[0].user.id
    // }
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
          }}
      >


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
                }]}
            >
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
