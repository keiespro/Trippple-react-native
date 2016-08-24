import { combineReducers } from 'redux';
import userReducer from './userReducer'
import deviceReducer from './deviceReducer'
import appReducer from './appReducer'
import authReducer from './authReducer'
import uiReducer from './uiReducer'
import appNavReducer from './appNavReducer'
import facebookReducer from './facebookReducer'
import potentialsReducer from './potentialsReducer'
import matchesReducer from './matchesReducer'
import matchesListReducer from './matchesListReducer'
import newMatchesReducer from './newMatchesReducer'
import unreadReducer from './unreadReducer'
import chatReducer from './chatReducer'
import nagReducer from './nagReducer'
import notificationsReducer from './notificationsReducer'
import LikeReducer from './LikeReducer'

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
  likes:          LikeReducer
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
