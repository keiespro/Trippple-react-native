import React from "react";
import { StyleSheet, Text, View, StatusBar, LayoutAnimation, Image, TouchableOpacity, TouchableHighlight, Animated, ScrollView, Dimensions } from "react-native";
import styles from './styles';
import {pure} from 'recompose'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const DenyIcon = props =>
    <Animated.View
        key={'denyicon'}
        style={[styles.animatedIcon, {
            opacity: props.pan ? props.pan.x.interpolate({
                inputRange: [-DeviceWidth, -100, 0],
                outputRange: [1, 1, 0],
            }) : 0,
            transform: [
                {
                    scale: props.pan ? props.pan.x.interpolate({
                        inputRange: [-DeviceWidth/2, -30, 0, 30, DeviceWidth],
                        outputRange: [2.5, 0, 0, 0, 2],
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
                        inputRange: [-DeviceWidth, -DeviceWidth/3, -50],
                        outputRange: [-100, 20, 200],
                    }) : 0,
                },
            ],
            marginLeft: 0,
        }]}
    >
      <Image
          source={{ uri: 'assets/iconDeny@3x.png' }}
          style={{
              backgroundColor: 'transparent',
              width: 100,marginLeft:-50,
              height: 100,
              paddingLeft: 0,
          }}
      />
    </Animated.View>;


export default pure(DenyIcon);
