import React from 'react';
import { Image, Animated, Dimensions, Platform } from 'react-native';
import {pure} from 'recompose'
import styles from './styles';
import colors from '../../../utils/colors'

const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const ApproveIcon = props => (
  <Animated.View
    key={'approveicon'}
    style={[styles.animatedIcon, {
      opacity: props.pan ? props.pan.x.interpolate({
        inputRange: [0, 100, DeviceWidth / 2, DeviceWidth],
        outputRange: [0, 1, 1, 0],
      }) : 0,
      backgroundColor: iOS ? 'transparent' : colors.white,
      transform: [
        {
          scale: props.pan ? props.pan.x.interpolate({
            inputRange: [-DeviceWidth, 0, DeviceWidth / 2],
            outputRange: [2, 0.1, 2.5],
            extrapolate: 'clamp',
          }) : 0,
        },
        {
          translateY: props.pan ? props.pan.y.interpolate({
            inputRange: [0, (DeviceHeight)],
            outputRange: [-30, 120],
          }) : 0,
        }, {
          translateX: props.pan ? props.pan.x.interpolate({
            inputRange: [50, DeviceWidth / 3, DeviceWidth],
            outputRange: [-100, 50, 220],
          }) : 0,
        },
      ],
    }]}
  >
    <Image
      source={require('./assets/iconApprove@3x.png')}
      style={{
        width: 100,
        height: 100,
        left: iOS ? -50 : 0,
        position: 'relative',
        paddingRight: 0,
        tintColor: iOS ? colors.white : colors.sushi
      }}
    />
  </Animated.View>
)

export default pure(ApproveIcon)
