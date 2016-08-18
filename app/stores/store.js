import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from '../reducers';
import devTools from 'remote-redux-devtools';
import thunkMiddleware from 'redux-thunk';
import {AsyncStorage} from 'react-native'

import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'

const logger = createLogger({
  collapsed: (s,action) => (!global.__DEBUG__ || action.type.indexOf('PENDING') > -1)
});
const middlewares = [thunkMiddleware, promiseMiddleware()]

function configureStore(initialState = ({})) {
  if (__DEV__) {

    const store = createStore(
      createReducer(),
      initialState,
      compose(
        autoRehydrate(),
        applyMiddleware(...middlewares, logger),
        devTools(),
      )
    );
    persistStore(store, {storage: AsyncStorage,blacklist:['AppNav']})

    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('../reducers/').default;
        store.replaceReducer(nextRootReducer());
      });
    }

    return store

  } else {

    const store = createStore(
      createReducer(),
      initialState,
      compose(
        autoRehydrate(),
        applyMiddleware(...middlewares),
      )
    );
    persistStore(store, {storage: AsyncStorage,blacklist:['AppNav']})

  }
}

module.exports = configureStore;
