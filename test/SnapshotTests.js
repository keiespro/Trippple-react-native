import {AppRegistry,View} from "react-native";
import TestHarness from '../TestHarness'

__TEST__ = true;

global.__TEST__ = true;

const Trippple = (props => <View {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

TestHarness({})
