import {Platform, TouchableOpacity, TouchableNativeFeedback} from 'react-native'
import React, {Component} from 'react'
import colors from '../utils/colors';

export const Button = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback//AndroidTouchable
})

class AndroidTouchable extends Component{

  render(){
    return (
      <TouchableNativeFeedback
        useForeground
        background={TouchableNativeFeedback.SelectableBackground(this.props.underlayColor || colors.dark)}
        {...this.props}
      >
        {this.props.children}
      </TouchableNativeFeedback>
    )
  }
}
