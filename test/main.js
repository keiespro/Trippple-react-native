import {AppRegistry} from "react-native";
import TestHarness from '../TestHarness'
import Donnie from './mockData/Donnie.js'

__TEST__ = true;

global.__TEST__ = true;

const mainProps =  {
  user:Donnie.userInfo,
  isVisible:true,
  match: Donnie.matches[0],
}


const Trippple = (props => <View {...props} />)

AppRegistry.registerComponent('Trippple', () => Trippple)

TestHarness(mainProps)
