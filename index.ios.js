/*
* @providesModule trippple
* @flow
*/

import React, { View, AppRegistry } from 'react-native'
import Boot from './app/Boot'
import Log from './app/utils/logger'
import alt from './app/flux/alt'

// delete window.Promise
// import Promise from 'bluebird'
// window.Promise = Promise
  window.React = React;
  window.alt = alt;

if(__DEV__){
  console.ignoredYellowBox = ['jsSchedulingOverhead'];
  // window.onunhandledrejection = e => console.warn('unhandled', e);
  // window.onrejectionhandled = e => console.warn('handled', e );
}

// Promise.onPossiblyUnhandledRejection = ((error) => {
//    Log('Unhandled rejection',err);
// });

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
