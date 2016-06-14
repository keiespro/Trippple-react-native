/*
* @providesModule Trippple
* @flow
*/

import React from "react";

import ReactNative, {View, AppRegistry, NativeModules} from "react-native";
import Boot from './app/Boot'
import alt from './app/flux/alt'
// import {whyDidYouUpdate} from 'why-did-you-update'



if(typeof window !== 'undefined' && __DEV__ && process.env.NODE_ENV !== 'production'){
  global = window;
  window.ReactNative = ReactNative;
  window.alt = alt;
  // window.__SHOW_ALL__ && whyDidYouUpdate(React, { exclude: [/^YellowBox/,/^onChangeText/] });

}
if(__DEV__){
  console.ignoredYellowBox = [`{"line":`, 'jsSchedulingOverhead','SocketRocket','ScrollView','WARNING','Value did not change','Value is a function','%cfont-weight','Warning'];

}

class Trippple extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return <Boot/>
  }
}

Trippple.displayName = 'Trippple'
AppRegistry.registerComponent('Trippple', () => Trippple)
