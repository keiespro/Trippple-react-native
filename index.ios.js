/*
* @providesModule trippple
* @flow
*/

import React, { View, AppRegistry } from 'react-native'
import Boot from './app/Boot'
import Log from './app/utils/logger'
import alt from './app/flux/alt'


if(__DEV__){
  window.React = React;
  window.alt = alt;
  console.ignoredYellowBox = ['jsSchedulingOverhead','SocketRocket','ScrollView'];
}


class trippple extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return <Boot/>
  }
}

export default trippple
AppRegistry.registerComponent('trippple', () => trippple)
