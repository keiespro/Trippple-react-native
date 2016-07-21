import {AppRegistry} from "react-native";
import TestHarness from '../TestHarness'
import Danny from './test/mockData/Danny.js'

__TEST__ = true;

global.__TEST__ = true;

const coupleProps =  {
  user:Danny.userInfo,
  currentMatch:Danny.matches[0],
  messages:[],
  newMatches:Danny.newMatches,
  matches:Danny.matches,
  potentials:Danny.potentials,
  potentialsMeta:,
    LastNotificationsPermissionRequestTimestamp: null,
    relevantUser: null,
    requestNotificationsPermission: null,
    hasSeenNotificationPermission: null,
  }
}

const Trippple = (props => <TestHarness {...coupleProps} {...props}/>)

AppRegistry.registerComponent('Trippple', () => Trippple)

console.log("Registered Testable Components:", AppRegistry.getAppKeys());
