import {AppRegistry,View} from "react-native";
import TestHarness from '../TestHarness'
import Danny from './mockData/Danny.js'

__TEST__ = true;

global.__TEST__ = true;

const coupleProps =  {
  user:Danny.userInfo,
  currentMatch:Danny.matches[0],
  messages:Danny.messages,
  newMatches:Danny.newMatches,
  matches:Danny.matches,
  potentials:Danny.potentials,
  potentialsMeta:{
    LastNotificationsPermissionRequestTimestamp: null,
    relevantUser: null,
    requestNotificationsPermission: null,
    hasSeenNotificationPermission: null,
  }
}


const Trippple = (props => <View {...props} />)

AppRegistry.registerComponent('Trippple', () => Trippple)

TestHarness(coupleProps)
