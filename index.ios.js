import React from "react";
import ReactNative, {View, AppRegistry, NativeModules} from "react-native";

import NewBoot from './app/NewBoot'
// import './ReactotronConfig'


console.log('index.IOS.js');

if(typeof window !== 'undefined' && (__DEV__ ) && process.env.NODE_ENV !== 'production'){
  global = window;
  window.ReactNative = ReactNative;
  window.React = React;
  // document.getElementById('root').style.zoom = "0.7"; // Makes Redux devtools roomier
  console.log(global,global.window.document,window.frames)
}
if(__DEV__){
  console.ignoredYellowBox = [`{"line":`, 'jsSchedulingOverhead','SocketRocket','ScrollView','WARNING','Value did not change','Value is a function','%cfont-weight','Warning','Task oprhaned'];

}

const Trippple = (props => <NewBoot {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)
