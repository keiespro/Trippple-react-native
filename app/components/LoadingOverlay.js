/**
 * @flow
 */

import React from "react";

 import {BlurView} from 'react-native-blur';


import {View, ActivityIndicator, StyleSheet,Dimensions} from "react-native";
import FadeInContainer from './FadeInContainer'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import Welcome from './welcome/welcome'

class LoadingOverlay extends React.Component{
  constructor(props){
    super()
    this.state = {}
  }
  render() {
    return (
      <View style={{position:'absolute',top:0,left:0}}>
      <FadeInContainer onShow={()=>this.setState({welcome:true})} fadeOut={true} duration={1000} delay={1000}>
      <BlurView style={styles.background} blurType="dark">
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.spinner} />
        </BlurView>
        </FadeInContainer>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:DeviceWidth,
    height:DeviceHeight
  },
})

export default LoadingOverlay
