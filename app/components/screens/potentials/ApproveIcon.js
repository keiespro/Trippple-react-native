import React from "react";
import { StyleSheet, Text, View, StatusBar, LayoutAnimation, Image, TouchableOpacity, TouchableHighlight, Animated, ScrollView, Dimensions } from "react-native";
import styles from './styles';
import {pure} from 'recompose'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const ApproveIcon = (props) =>
    <Animated.View
      key={'approveicon'}
      style={[styles.animatedIcon, {
        opacity: props.pan ? props.pan.x.interpolate({
          inputRange: [0, 100, DeviceWidth],
          outputRange: [0, 1, 1],
        }) : 0,
        transform: [
          {
            scale: props.pan ? props.pan.x.interpolate({
              inputRange: [0, 1, DeviceWidth],
              outputRange: [0.1, 0.1, 5],
              extrapolate: 'clamp',
            }) : 0,
          },
          {
            translateY: props.pan ? props.pan.y.interpolate({
              inputRange: [0, (DeviceWidth / 2) - 40],
              outputRange: [0, 10],
            }) : 0,
          }, {
            translateX: props.pan ? props.pan.x.interpolate({
              inputRange: [0, (DeviceWidth / 3) - 40],
              outputRange: [0, 0],
            }) : 0,
          },
        ],
      }]}
    >
      <Image
        source={{ uri: 'assets/iconApprove@3x.png' }}
        style={{
          width: 100,
          height: 100,
          left:-50,
          position:'relative',
          paddingRight: 0,
          backgroundColor: 'transparent',
        }}
      />
  </Animated.View>;

  export default pure(ApproveIcon)
