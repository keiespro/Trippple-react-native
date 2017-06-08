import React from 'react';
import ReactNative, {AppRegistry} from 'react-native';
import NewBoot from './app/NewBoot'

if(typeof window !== 'undefined' && (__DEV__) && process.env.NODE_ENV !== 'production'){
  console.log('index.IOS.js');
  global = window;
  window.ReactNative = ReactNative;
  window.React = React;
}
if(__DEV__){
  console.ignoredYellowBox = [
    '{"line":',
    'jsSchedulingOverhead',
    'SocketRocket',
    'Possible Unhandled Promise Rejection',
    'ScrollView',
    'WARNING',
    'Value did not change',
    'Value is a function',
    '%cfont-weight',
    'Warning',
    'Task orphaned',
    'Animated: `use',
    'Image source',
    `View #`,
    `console.error`,
  ];
  console.ignoredRedBox = [
    'Image source',
    `console.error`

  ];
}

const Trippple = (props) => (<NewBoot {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

export default Trippple
