import React from "react";
import ReactNative, {View, AppRegistry, NativeModules} from "react-native";

import NewBoot from './app/NewBoot'

console.log('index.IOS.js');

if(typeof window !== 'undefined' && (__DEV__ ) && process.env.NODE_ENV !== 'production'){
  global = window;
  window.ReactNative = ReactNative;
  window.React = React;
}
if(__DEV__){
  console.ignoredYellowBox = [`{"line":`, 'jsSchedulingOverhead','SocketRocket','ScrollView','WARNING','Value did not change','Value is a function','%cfont-weight','Warning','Task oprhaned'];

}

const Trippple = (props => <NewBoot {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)
