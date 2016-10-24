import { View, ActivityIndicator, Dimensions, Platform, NativeModules, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import MatchesButton from './MatchesButtonIcon'
import SettingsButton from './SettingsButton'
import CardStack from './CardStack';
import PotentialsPlaceholder from './PotentialsPlaceholder';
import colors from '../../../utils/colors';
import styles from './styles';

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


const ToolbarLogo = () => (
  <View style={{paddingTop: 5}}>
    <Image
      resizeMode={Image.resizeMode.contain}
      style={{
        width: 80,
        height: 30,
        tintColor: __DEV__ ? colors.daisy : colors.white,
        alignSelf: 'center'
      }}
      source={require('./assets/tripppleLogoText.png')}
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
      source={require('./assets/close.png')}
    />
  </TouchableOpacity>
)

const Toolbar = () => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 60,
      position: 'absolute',
      width: DeviceWidth,
      alignItems: 'center',
      zIndex: 10,
      top: 0,
    }}
  >
    <SettingsButton />
    <ToolbarLogo />
    <MatchesButton />
  </View>
)

class Potentials extends React.Component{
  static route = {
    styles: {zIndex: -10, position: 'relative', elevation: -5},
    navigationBar: {
      visible: iOS,
      translucent: false,
      backgroundColor: colors.transparent,
      renderTitle(route, props){
        return route.params.show ? <ToolbarLogo/> : false
      },
      renderLeft(route, props){
        return route.params.show ? <SettingsButton /> : <CloseProfile route={route}/>
      },
      renderRight(route, props){
        return route.params.show ? <MatchesButton /> : false
      }
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
    if (this.props.user.status){

    }

    iOS && NativeModules.PushNotificationManager.checkPermissions((result) => {
      const pushPermission = Object.keys(result).reduce((acc, el) => {
        acc += result[el];
        return acc
      }, 0)
      this.setState({hasPushPermission: (pushPermission > 0) })
    })
  }

  componentWillReceiveProps(nProps){
    const nui = nProps;
    const ui = this.props;
    if (!nui.profileVisible && ui.profileVisible){
      this.props.navigator.updateCurrentRouteParams({
        visible: false, show: true, dispatch: this.props.dispatch
      })
    } else if (nui.profileVisible && !ui.profileVisible){
      this.props.navigator.updateCurrentRouteParams({show: false, visible: false, dispatch: this.props.dispatch })
    }
  }

  getPotentialInfo(){
    if (!this.props.potentials || !this.props.potentials.length){ return false }
    const potential = this.props.potentials[0];
    let matchName = potential.user.firstname.trim();
    // let distance = potential.user.distance;
    if (potential.partner && potential.partner.gender) {
      matchName += ` & ${potential.partner.firstname.trim()}`;
      // distance = Math.min(distance, potential.partner.distance);
    }
    return matchName
  }

  toggleProfile(){
    __DEV__ && console.warn('nothing');
  }

  render(){
    const { potentials, user } = this.props

    return (
      <View
        style={{
          width: DeviceWidth,
          height: DeviceHeight,
          top: iOS ? -64 : 0,
          position: 'relative',
        }}

      >
        {!iOS && <Toolbar />}

        <View
          style={[
            styles.cardStackContainer,
            {
              top: iOS ? (this.props.profileVisible ? 70 : 60) : 0,
              position: 'relative',
            }
          ]}
          pointerEvents={'box-none'}
        >

          { potentials.length && this.state.showPotentials ?
            <CardStack
              user={user}
              dispatch={this.props.dispatch}
              rel={user.relationship_status}
              potentials={potentials}
              navigator={this.props.navigator}
              profileVisible={this.props.profileVisible}
              toggleProfile={this.toggleProfile.bind(this)}
            /> : null
          }

          {!this.state.didShow && potentials.length < 1 ?
            <View
              style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: DeviceHeight,
                width: DeviceWidth,
                position: 'absolute',
                top: 0,
                left: 0
              }]}
            >
              <ActivityIndicator
                size={'large'}
                style={[{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 80,
                  top: -40
                }]}
                animating
              />
            </View> : null
          }

          { (!potentials) || (potentials && potentials.length < 1) ?
            <PotentialsPlaceholder
              navigator={this.props.navigator}
              navigation={this.props.navigation}
              user={this.props.user}
              didShow={this.state.didShow}
              onDidShow={() => { this.setState({didShow: true}); }}
            /> : null
          }

        </View>
      </View>
    )
  }
}

Potentials.displayName = 'Potentials'

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  potentials: state.potentials,
  unread: state.unread,
  ui: state.ui,
  profileVisible: state.ui.profileVisible
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Potentials);
