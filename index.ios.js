/*
* @providesModule Trippple
* @flow
*/

import React from "react";

import ReactNative, {View, AppRegistry, NativeModules} from "react-native";
import Boot from './app/Boot'
import alt from './app/flux/alt'


if(typeof window !== 'undefined' && __DEV__){
  global = window;
  window.ReactNative = ReactNative;
  window.alt = alt;
  console.ignoredYellowBox = ['jsSchedulingOverhead','SocketRocket','ScrollView'];
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
