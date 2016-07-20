/*
* @flow
*/
import {AppRegistry} from "react-native";
import TestHarness from './TestHarness'

console.log('index.TEST.js');

const Trippple = (props => <TestHarness {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

console.log("Registered Testable Components:", AppRegistry.getAppKeys());
