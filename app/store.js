import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from './reducers/';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import {REHYDRATE} from 'redux-persist/constants'

import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import throttleActions from 'redux-throttle-actions'

const logger = createLogger({
  diff: true,
  level: 'log',
  collapsed: (s,action) => (!global.__DEBUG__ || action.type.indexOf('PENDING') > -1)
});
const throttle = throttleActions(['GET_POTENTIALS','UPDATE'], 5000)
const middlewares = [thunk, promiseMiddleware(), createActionBuffer(REHYDRATE), throttle ]

function configureStore(initialState = ({})) {
  if (__DEV__) {

    const store = createStore(
      createReducer(),
      initialState,
      compose(
        autoRehydrate(),
        applyMiddleware(...middlewares, logger),
        global.reduxNativeDevTools ? global.reduxNativeDevTools(/*options*/) :  devTools({
          realtime: true
        }),
      )
    );
    global.reduxNativeDevTools && global.reduxNativeDevTools.updateStore(store);
    !global.reduxNativeDevTools && devTools.updateStore(store);

    persistStore(store, {storage: AsyncStorage,blacklist:['appNav','ui']}).purge(['appNav'])

    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('./reducers/').default;
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
    return store

  }
}

module.exports = configureStore;
