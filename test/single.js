import {AppRegistry} from "react-native";
import TestHarness from '../TestHarness'
import Donnie from './test/mockData/Donnie.js'

__TEST__ = true;

global.__TEST__ = true;

const singleProps =  {
  user:Donnie.userInfo,
  currentMatch:Donnie.matches[0],
  messages:[],
  newMatches:Donnie.newMatches,
  matches:Donnie.matches,
  potentials:Donnie.potentials,
  potentialsMeta:,
    LastNotificationsPermissionRequestTimestamp: null,
    relevantUser: null,
    requestNotificationsPermission: null,
    hasSeenNotificationPermission: null,
  }
}

const Trippple = (props => <TestHarness {...singleProps} {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

console.log("Registered Testable Components:", AppRegistry.getAppKeys());
