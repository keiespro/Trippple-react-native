import { NavigationReducer as navigation  } from '@exponent/ex-navigation'
import { combineReducers } from 'redux'
import LikeReducer  from './LikeReducer'
import appNavReducer  from './appNavReducer'
import appReducer  from './appReducer'
import authReducer  from './authReducer'
import chatReducer  from './chatReducer'
import deviceReducer  from './deviceReducer'
import facebookReducer  from './facebookReducer'
import matchesListReducer  from './matchesListReducer'
import matchesReducer  from './matchesReducer'
import nagReducer  from './nagReducer'
import newMatchesReducer  from './newMatchesReducer'
import notificationsReducer  from './notificationsReducer'
import potentialsReducer  from './potentialsReducer'
import uiReducer  from './uiReducer'
import unreadReducer  from './unreadReducer'
import userReducer  from './userReducer'

const applicationReducers = {
  user:           userReducer,
  device:         deviceReducer,
  app:            appReducer,
  auth:           authReducer,
  ui:             uiReducer,
  appNav:         appNavReducer,
  fbUser:         facebookReducer,
  unread:         unreadReducer,
  matches:        matchesReducer,
  newMatches:     newMatchesReducer,
  matchesList:    matchesListReducer,
  potentials:     potentialsReducer,
  messages:       chatReducer,
  nag:            nagReducer,
  notifications:  notificationsReducer,
  likes:          LikeReducer,
  navigation
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
