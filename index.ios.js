/*
* @providesModule trippple
* @flow
*/

import React, { AppRegistry } from 'react-native'
import Boot from './app/Boot'
import Log from './app/utils/logger'

delete window.Promise
import Promise from 'bluebird'
window.Promise = Promise

if(__DEV__){
  console.ignoredYellowBox = ['jsSchedulingOverhead'];
  window.React = React;
  window.onunhandledrejection = e => console.warn('unhandled', e);
  window.onrejectionhandled = e => console.warn('handled', e );
}

Promise.onPossiblyUnhandledRejection = ((error) => {
   Log('Unhandled rejection',err);
});

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
