import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { MagicNumbers } from '../../../utils/DeviceConfig';
import Btn from '../../Btn';
import colors from '../../../utils/colors';

class FacebookButton extends Component {

  static defaultProps = {
    buttonText: 'FACEBOOK',
    shouldLogoutOnTap: false,
  };

  constructor(props) {
    super()
    this.state = {
      fbUser: props.fbUser
    }
  }

  onPress(e) {
    this.props.onPress ? this.props.onPress(e) : (this.props._onPress && this.props._onPress(e))
  }

  render() {
    return (
      <Btn
        color={colors.white}
        disabled={this.props.busy}
        elevation={10}
        inStyle={[styles.iconButtonOuter]}
        onPress={this.onPress.bind(this)}
      >
        <Icon name="sc-facebook" size={40} color="#fff" style={styles.icon}/>
        <Text style={styles.btntext}>{this.props.buttonText || 'LOG IN WITH FACEBOOK'}</Text>
      </Btn>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5
  },
  LogoBox: { },
  btntext: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 17,
    fontWeight: '800'
  },
  iconButtonOuter: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.cornFlower,
    flexGrow: 0,
    justifyContent: 'center',
    margin: 0,
    paddingHorizontal: 30,
    flexDirection: 'row',
    height: 70,
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  button: {
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height: MagicNumbers.is5orless ? 50 : 50,
  },
  buttonIcon: {
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,
    width: 40,
  },
})

export default FacebookButton;
