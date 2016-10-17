import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from './reducers/';
import {composeWithDevTools} from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import throttleActions from 'redux-throttle-actions';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import { createNavigationEnabledStore } from '@exponent/ex-navigation'
import ActionMan from './actions/'

const logger = createLogger({
  diff: true,
  level: 'debug',
  collapsed: (s, action) => (!global.__DEBUG__ || action.type.indexOf('PENDING') > -1)
});

const middlewares = [
  thunk,
  promiseMiddleware(),
  throttleActions(['EX_NAVIGATION.PUSH'], 500),
  createActionBuffer('EX_NAVIGATION.INITIALIZE'),
]

function configureStore(initialState = ({})) {
  if (global.__DEV__) {
    const store = createNavigationEnabledStore(createStore)(
        createReducer(),
        initialState,
        compose(
          applyMiddleware(...middlewares, logger),
          autoRehydrate(),
          global.reduxNativeDevTools ? global.reduxNativeDevTools({
            getMonitor: (monitor) => { isMonitorAction = monitor.isMonitorAction; },
            actionCreators: ActionMan
          }) : f => f,
        ),

      );

    persistStore(store, {
      storage: AsyncStorage, blacklist: ['navigation', 'ui', 'potentials', 'appNav']
    }).purge(['navigation'])

    if (global.reduxNativeDevTools) {
      global.reduxNativeDevTools.updateStore(store);
    }

    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer());
      });
    }

    return store
  } else {
    const store = createNavigationEnabledStore(createStore)(
        createReducer(),
        initialState,
        compose(
          applyMiddleware(...middlewares),
          autoRehydrate(),
        )
      );
    persistStore(store, {storage: AsyncStorage, blacklist: ['navigation', 'ui', 'potentials', 'appNav']})
    return store
  }
}

module.exports = configureStore;
