import { combineReducers } from 'redux';
import userReducer from './userReducer'
import deviceReducer from './deviceReducer'
import appReducer from './appReducer'
import authReducer from './authReducer'
import uiReducer from './uiReducer'

const applicationReducers = {
  user:       userReducer,
  device:     deviceReducer,
  app:        appReducer,
  auth:       authReducer,
  ui:         uiReducer

};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
