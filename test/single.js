import {AppRegistry} from "react-native";
import TestHarness from '../TestHarness'
import Donnie from './mockData/Donnie.js'

__TEST__ = true;

global.__TEST__ = true;

const singleProps =  {
  user:Donnie.userInfo,
  currentMatch:Donnie.matches[0],
  messages:Donnie.messages,
  matches:Donnie.matches,
  potentials:Donnie.potentials,
  potentialsMeta:{
    LastNotificationsPermissionRequestTimestamp: null,
    relevantUser: null,
    requestNotificationsPermission: null,
    hasSeenNotificationPermission: null,
  }
}


const Trippple = (props => <View {...props} />)

AppRegistry.registerComponent('Trippple', () => Trippple)

TestHarness(singleProps)
