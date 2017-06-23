import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { MagicNumbers } from '../../utils/DeviceConfig';
import colors from '../../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class ContinueButton extends Component {

  static defaultProps = {
    canContinue: false
  };

  constructor(props) {
    super();

    this.state = {
      loading: false,
      yVal: new Animated.Value(0)
    }
  }

  componentWillReceiveProps(nProps) {
    if (nProps.canContinue != this.props.canContinue) {
      Animated.timing(this.state.yVal, {
        toValue: nProps.canContinue ? 1 : 0,
        duration: 200,
        useNativeDriver: Platform.select({ios: false, android: true})
      }).start()
    }
  }

  handleContinue() {
    if (this.state.submitting) { return false; }
    this.setState({submitting: true});
    this.props.handlePress();
  }

  nothing() {}

  render() {
    return (
      <Animated.View style={[styles.continueButtonWrap,
        {
          bottom: 0,
          backgroundColor: this.props.canContinue ? colors.brightPurple : 'transparent',
          left: 0,
          position: this.props.absoluteContinue ? 'absolute' : null,
          opacity: this.state.yVal,
          transform: [
          {
            translateY: this.state.yVal.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0]
            })
          }
          ]
        }]}
      >
        <TouchableHighlight
          onPress={this.props.handlePress}
          style={[styles.continueButton]}
          underlayColor={colors.darkPurple}
        >
          <View>
            {this.state.submitting || this.props.loading ? (
              <ActivityIndicator
                style={{alignSelf: 'center', alignItems: 'center', flexGrow: 1, height: 60, width: 60, justifyContent: 'center'}}
                animating
              />
            ) : (
              <Text style={[styles.continueButtonText, {
                color: this.props.canContinue ? colors.white : 'transparent'
              }]}
              >{this.props.customText || 'CONTINUE'}</Text>
            )}
          </View>
        </TouchableHighlight>
      </Animated.View>
    )
  }
}


const styles = StyleSheet.create({
  continueButtonWrap: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: MagicNumbers.continueButtonHeight - 4,
    width: DeviceWidth,
    flexGrow:10,
    maxHeight:90,
    position:'relative',
    overflow:'hidden'
  },
  continueButton: {
    height: MagicNumbers.continueButtonHeight - 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: DeviceWidth,
    backgroundColor: colors.brightPurple,
    overflow:'hidden'

  },
  continueButtonText: {
    padding: 4,
    fontSize: MagicNumbers.size18 + 4,
    fontFamily: 'montserrat', fontWeight: '800',
    color: colors.white,
    textAlign: 'center'
  }
});

export default ContinueButton;
