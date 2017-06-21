import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import FBSDK from 'react-native-fbsdk';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import { MagicNumbers } from '../../../utils/DeviceConfig';
import ActionMan from '../../../actions/';
import BoxyButton from '../../controls/boxyButton';
import colors from '../../../utils/colors';

const { AccessToken, LoginManager, GraphRequest, GraphRequestManager } = FBSDK;
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class FacebookButton extends Component {

  static propTypes = {
    buttonText: PropTypes.string,
    buttonType: PropTypes.oneOf(['login', 'upload', 'connectionStatus', 'onboard', 'settings']),
  };

  static defaultProps = {
    buttonText: 'FACEBOOK',
    shouldLogoutOnTap: false,
  };

  constructor(props) {
    super();

    this.state = {
      fbUser: props.fbUser
    }
  }

  onPress(e) {
    this.props.onPress && this.props.onPress(e) || this.props._onPress && this.props._onPress(e)
  }

  render() {
    let buttonText = this.props.buttonText;

    switch (this.props.buttonType) {
      case 'uploadImage':
        buttonText = 'UPLOAD FROM FB'
        break;
      case 'connectionStatus':
        buttonText = this.state.fbUser ? 'CONNECTED' : 'CONNECT WITH FB';
        break;
      case 'onboard':
        buttonText = this.state.fbUser ? 'VERIFIED' : 'VERIFY WITH FB'
        break;
      case 'login':
        buttonText = 'LOG IN WITH FACEBOOK'
        break;
      case 'settings':
        buttonText = this.state.fbUser ? 'VERIFY NOW' : 'VERIFY NOW'
        break;
    }

    return (
      <BoxyButton
        text={this.props.buttonText || 'LOG IN WITH FACEBOOK'}
        buttonText={this.props.buttonTextStyle}
        outerButtonStyle={[styles.iconButtonOuter, this.props.outerButtonStyle]}
        leftBoxStyles={[styles.buttonIcon, this.props.leftBoxStyles]}
        innerWrapStyles={[styles.button, this.props.buttonStyles]}
        underlayColor={colors.cornFlower}
        elevation={10}
        _onPress={this.onPress.bind(this)}
      >
        <Image
          source={require('./fBLogo@3x.png')}
          resizeMode={Image.resizeMode.contain}
          style={{height: 30, width: 20, }}
          tintColor={this.props.iconTintColor}
        />
      </BoxyButton>

    )
  }
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height: MagicNumbers.is5orless ? 50 : 60,
  },
  buttonIcon: {
    backgroundColor: colors.cornFlower20,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    width: 60,
  },
  iconButtonOuter: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    flexGrow: 1,
    flexDirection: 'row',
    marginVertical: 15,
    height: MagicNumbers.is5orless ? 50 : 60,
  },
  LogoBox: { },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
})

export default FacebookButton;
