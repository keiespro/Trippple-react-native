import React from 'react'
import { Platform, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native'

const androidTouchable = ({color, onPress, children, inStyle = {}}) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple(color)}
    onPress={onPress}
    useForeground
  >
    <View style={inStyle}>
      {children}
    </View>
  </TouchableNativeFeedback>
)

const iosTouchable = ({color, onPress, children, inStyle = {}}) => (
  <TouchableHighlight
    underlayColor={(color)}
    onPress={onPress}
  >
    <View style={inStyle}>
      {children}
    </View>
  </TouchableHighlight>
)


module.exports = Platform.select({
  ios: iosTouchable,
  android: androidTouchable
})
