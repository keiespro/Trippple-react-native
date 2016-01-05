/**
 * @flow
 */

import React, { SliderIOS, Text, StyleSheet, View, } from 'react-native'

const DistanceSlider = React.createClass({
  getInitialState() {
    return {
      value: 0,
    };
  },

  render() {
    return (
      <View
        style={styles.container}
        pointerEvents={'box-none'}
        onMoveShouldSetResponder={()=>{return true}}
        onResponderGrant={()=>{}}
        onStartShouldSetResponderCapture={(e)=>{}}
        onMoveShouldSetResponderCapture={(e)=>{}}
        onResponderTerminate={()=>{}}
        >
        <Text style={styles.text} >
          {this.state.value}
        </Text>
        <SliderIOS
          style={styles.slider}
          pointerEvents={'box-none'}
          minimumValue={10}
          maximumValue={500}
          onValueChange={(value) => this.props.handler(parseInt(value))} />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container:{
    height:150,
    flex:1,
    alignSelf:'stretch',
    alignItems:'stretch',
    left:0,
    right:0
  },
  slider: {
    height: 100,
    alignSelf:'stretch',
    flex:1,
    left:0,
    right:0
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
});

export default DistanceSlider;
