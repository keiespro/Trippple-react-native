import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Navigator,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import colors from '../../../utils/colors'
import {MagicNumbers} from '../../../utils/DeviceConfig'
import WhyFacebook from './WhyFacebook'
import Login from './login';
import ActionMan from '../../../actions/';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class FacebookLogin extends Component{

  constructor(){
    super()
    this.state = {
      user: null,
    }
  }

  login(){
    this.props.dispatch(ActionMan.loginWithFacebook())
  }

  triggerPhoneLogin(){
    this.props.navigator.push({
      component: Login,
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      title: 'Log in',
      id: 'login',
      passProps: {
        navigator: this.props.navigator
      }
    });
  }

  whyFacebookModal(){
    this.props.navigator.push({
      component: WhyFacebook,
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      title: 'Why Facebook?',
      id: 'whyfb',
      passProps: {
      }
    });
  }

  render() {
    return (
      <View style={{width: DeviceWidth, height: DeviceHeight, backgroundColor: colors.outerSpace}}>

        <View style={[styles.container, {}]}>

          <View style={{alignSelf: 'stretch'}}>

            <FacebookButton
              shouldAuthenticate
              buttonText={this.props.tab == 'register' ? 'SIGN UP WITH FACEBOOK' : null}
              onPress={this.login.bind(this)}
            />

            <View style={styles.middleTextWrap}>
              <Text style={[styles.middleText, {fontSize: 17, marginTop: 20, textAlign: 'center', width: MagicNumbers.screenWidth}]}>We will never post without your permission.</Text>
            </View>

          </View>

          <View style={[styles.middleTextWrap, styles.bottomwrap]}>
            {this.props.tab == 'login' ? <TouchableOpacity onPress={this.triggerPhoneLogin.bind(this)}>
              <Text style={{color: colors.rollingStone, fontSize: 16, textDecorationLine: 'underline'}}>Or use your phone number</Text>
            </TouchableOpacity> : <TouchableOpacity onPress={this.whyFacebookModal.bind(this)}>
              <Text style={{color: colors.rollingStone, fontSize: 16, textDecorationLine: 'underline'}}>Why Facebook?</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    );
  }
}
FacebookLogin.displayName = 'FacebookLogin'

export default FacebookLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: MagicNumbers.screenPadding / 2,
    paddingTop: 0,
    backgroundColor: colors.outerSpace
  },
  LogoBox: {
    width: 40
  },
  iconButtonOuter: {
    alignSelf: 'stretch',
    marginVertical: 15
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 20,
    fontFamily: 'omnes',
    textAlign: 'center',
    marginVertical: 20
  },
  iconButtonCouples: {
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  bottomwrap: {
  }
});
