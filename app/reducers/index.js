import { combineReducers } from 'redux';
import userReducer from './user'

const applicationReducers = {
  user: userReducer
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
