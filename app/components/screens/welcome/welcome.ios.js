import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import reactMixin from 'react-mixin';
import SplashScreen from 'react-native-splash-screen';
import TimerMixin from 'react-timer-mixin';
import { MagicNumbers } from '../../../utils/DeviceConfig';
import ActionMan from '../../../actions/';
import Carousel from './carousel';
import colors from '../../../utils/colors';
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import Loading from './Loading';

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


@reactMixin.decorate(TimerMixin)
export class Welcome extends Component {

  static route = {
    styles: NavigationStyles.Fade,
    navigationBar: {
      backgroundColor: colors.transparent,
      renderLeft(route, props){
        return false
      },
      renderRight(route, props) {
        return false
      },
      translucent: true,
      visible: false,
    },
    statusBar: {
      translucent: false,
      backgroundColor: colors.dark70,

    },
  };

  static displayName: 'Intro';

  constructor() {
    super();
  
    this.state = {
      isAnimating: false
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  componentWillReceiveProps(nProps) {
    if (nProps.loggedIn && nProps.status != this.props.status) {
      if (nProps.status == 'onboarded') {
        this.props.dispatch(ActionMan.resetRoute('Potentials'));
      } else {
        this.props.dispatch(ActionMan.resetRoute('Onboard'));
      }
    }
  }

  whyFacebookModal() {
    this.props.dispatch(ActionMan.showInModal({component: 'WhyFacebook', passProps: {}}));
  }

  termsModal() {
    this.props.dispatch(ActionMan.showInModal({component: 'Terms', passProps: {}}))
  }

  login() {
    this.props.dispatch({type: 'LOADING_PENDING'});
    this.setState({busy: true});
    this.setTimeout(() => {
      this.setState({busy: false})
    }, 10000);
    this.props.dispatch(ActionMan.loginWithFacebook());
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View>
          <Carousel />
        </View>
        <View style={styles.bottomButtons}>
          <FacebookButton
            busy={this.state.busy}
            buttonStyles={{
              backgroundColor: colors.cornFlower,
              borderWidth: 0,
              height: 80,
            }}
            buttonText={'LOG IN WITH FACEBOOK'}
            iconTintColor={'#fff'}
            leftBoxStyles={{height: 80}}
            onPress={this.login.bind(this)}
            outerButtonStyle={{height: 100, marginVertical: 0}}
            shouldAuthenticate
          />
          <View style={{
              alignItems:'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity
              style={{
                marginVertical: 20,
                width: 100,
                height: 30,
                zIndex: 9999,
              }}
              onPress={this.whyFacebookModal.bind(this)}
            >
              <View>
                <Text
                  style={{
                    color: colors.rollingStone,
                    fontFamily: 'omnes',
                    fontSize: 12,
                    textDecorationLine: 'underline',
                    textAlign: 'right'
                  }}
                >
                  Why Facebook?
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{marginVertical: 20, height: 30, width: 10, zIndex: 9999}} >
              <Text
                style={{
                  color: colors.rollingStone,
                  fontFamily: 'omnes',
                  fontSize: 12,
                  textAlign: 'center',
                }}
              >•</Text>
            </View>
            <TouchableOpacity
              style={{
                marginVertical: 20,
                width: 50,
                height: 30,
                zIndex: 9999,
              }}
              onPress={this.termsModal.bind(this)}
            >
              <View>
                <Text
                  style={{
                    color: colors.rollingStone,
                    fontFamily: 'omnes',
                    fontSize: 12,
                    textDecorationLine: 'underline',
                    textAlign: 'left',
                  }}
                >
                  Terms
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.busy && <Loading />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: colors.outerSpace,
  },
  activeDot: {
    backgroundColor: colors.mediumPurple,
    borderColor: colors.mediumPurple,
    borderWidth: 2,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
  },
  bottomButtons: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: undefined,
    height: 140,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    height: 45,
  },
  buttonText: {
    alignSelf: 'center',
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 22,
  },
  carousel: {
    marginTop: 0,
    width: DeviceWidth,
    height: DeviceHeight - 200,
  },
  container: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.outerSpace,
    justifyContent: 'space-between',
    margin: 0,
    padding: 0,
    position: 'relative',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  dot: {
    backgroundColor: colors.shuttleGray,
    borderColor: colors.shuttleGray,
    borderWidth: 2,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
  },
  textplain: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 22,
    fontFamily: 'omnes',
    textAlign: 'center'
  },
  slide: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: MagicNumbers.screenPadding / 2,
    width: DeviceWidth,
    height: DeviceHeight - 150,
  },
  bottomButton: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 0,
    height: 80,
  },
  loginButton: {
    backgroundColor: colors.shuttleGray,
  },
  registerButton: {
    backgroundColor: colors.mediumPurple,
  },
  wrap: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 0,
    paddingBottom: 0,
  },
});

const mapStateToProps = (state, p) => ({
  ...p,
  loggedIn: state.auth.api_key && state.auth.user_id, status: state.user.status
})
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
