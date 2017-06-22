import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
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
    super();

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
        <View style={styles.iconContainer}>
          <Icon name="sc-facebook" size={40} color="#fff" style={styles.icon}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.btntext}>{this.props.buttonText || 'LOG IN WITH FACEBOOK'}</Text>
        </View>
      </Btn>
    )
  }
}

const styles = StyleSheet.create({
  btntext: {
    color: colors.white,
    fontFamily: 'montserrat',
    fontSize: 17,
    fontWeight: '800'
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
  icon: {
    marginRight: 5
  },
  iconButtonOuter: {
    backgroundColor: colors.cornFlower,
    borderRadius: 3,
    flex: 0,
    flexDirection: 'row',
    margin: 0,
    width: 300,
    height: 70,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.darkCornFlower,
    borderRadius: 3,
    flex: 1,
    justifyContent: 'center',
  },
  middleTextWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: colors.cornFlower,
    borderRadius: 3,
    flex: 4,
    justifyContent: 'center',
  },
})

export default FacebookButton;
