/*
* @flow
*/

import React from "react";
import ReactNative, {View, AppRegistry, NativeModules} from "react-native";
import Boot from './app/Boot'

console.log('index.ANDROID.js');

if(typeof window !== 'undefined' && (__DEV__ ) && process.env.NODE_ENV !== 'production'){
  global = window;
  window.ReactNative = ReactNative;
  window.React = React;
}
if(__DEV__){
  console.ignoredYellowBox = [`{"line":`, 'jsSchedulingOverhead','SocketRocket','ScrollView','WARNING','Value did not change','Value is a function','%cfont-weight','Warning','Task oprhaned'];
}

const Trippple = (props => <Boot {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)
