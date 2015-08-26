/**
 * @flow
 */

import React from 'react-native';
import Overlay from 'react-native-overlay';
import {BlurView} from 'react-native-blur';

import { Component, View, ActivityIndicatorIOS, StyleSheet, } from 'react-native';

type Props = {
  isVisible: boolean;
}

class LoadingOverlay extends Component{

  


  render() {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <BlurView style={styles.background} blurType="dark">
          <ActivityIndicatorIOS
            size="large"
            animating={true}
            style={styles.spinner} />
        </BlurView>
      </Overlay>
    );
  }
}

var styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LoadingOverlay
