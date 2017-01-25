import React from 'react';
import { Image, Animated, Dimensions, Platform } from 'react-native';
import {pure} from 'recompose'
import styles from './styles';
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceWidth = Dimensions.get('window').width;

const DenyIcon = props => (
  <Animated.View
    key={'denyicon'}
    renderToHardwareTextureAndroid
    style={[styles.animatedIcon, {
      opacity: props.pan ? props.pan.x.interpolate({
        inputRange: [-DeviceWidth, -100, 0],
        outputRange: [1, 1, 0],
      }) : 0,
      backgroundColor: iOS ? 'transparent' : colors.white,

      transform: [
        {
          scale: props.pan ? props.pan.x.interpolate({
            inputRange: [-DeviceWidth / 2 + 10, 0, 0, 70, DeviceWidth],
            outputRange: [2, 0, 0, 0, 0],
            extrapolate: 'clamp',
          }) : 0,
        },
        {
          translateY: props.pan ? props.pan.y.interpolate({
            inputRange: [0, DeviceWidth],
            outputRange: [-30, 120],
          }) : 0,
        }, {
          translateX: props.pan ? props.pan.x.interpolate({
            inputRange: [-DeviceWidth, -DeviceWidth / 3, -50],
            outputRange: [-100, 20, 200],
          }) : 0,
        },
      ],
      marginLeft: 0,
    }]}
  >
    <Image
      source={require('./assets/iconDeny@3x.png')}
      style={{
        backgroundColor: 'transparent',
        marginLeft: iOS ? -50 : 0,
        height: 100,
        width:100,
        paddingLeft: 0,
        borderRadius:50,
        tintColor: iOS ? colors.white : colors.mandy
      }}
    />
  </Animated.View>
)


export default pure(DenyIcon);
