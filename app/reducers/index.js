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
import unreadReducer from './unreadReducer'

const applicationReducers = {
  user:       userReducer,
  device:     deviceReducer,
  app:        appReducer,
  auth:       authReducer,
  ui:         uiReducer,
  appNav:     appNavReducer,
  fbUser:     facebookReducer,
  unread:     unreadReducer,
  matches:    matchesReducer,
  potentials: potentialsReducer

};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
