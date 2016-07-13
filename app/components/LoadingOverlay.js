/**
 * @flow
 */

import React from "react";

import Overlay from 'react-native-overlay';
import {BlurView} from 'react-native-blur';

import {Component} from "react";
import {View, ActivityIndicator, StyleSheet} from "react-native";


class LoadingOverlay extends Component{
  constructor(props){
    super()
  }
  render() {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <BlurView style={styles.background} blurType="dark">
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.spinner} />
        </BlurView>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LoadingOverlay
