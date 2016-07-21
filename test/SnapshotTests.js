import {AppRegistry} from "react-native";
import TestHarness from '../TestHarness'

__TEST__ = true;

global.__TEST__ = true;

const Trippple = (props => <TestHarness {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

console.log("Registered Testable Components:", AppRegistry.getAppKeys());
