import {
  combineReducers
} from 'redux-immutable';

import nearby from './browse/nearby'
import newest from './browse/newest'
import popular from './browse/popular'

export default combineReducers({newest,nearby,popular})
