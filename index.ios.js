/*
* @providesModule Trippple
* @flow
*/

import React, { View, AppRegistry, } from 'react-native'
import Boot from './app/Boot'
import alt from './app/flux/alt'


if(typeof window !== 'undefined' && __DEV__){
  global = window;
  window.React = React;
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
