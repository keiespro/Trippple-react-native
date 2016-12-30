import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import throttleActions from 'redux-throttle-actions';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import { createNavigationEnabledStore } from '@exponent/ex-navigation'
import ActionMan from './actions/'
import createReducer from './reducers/';
import createPrefetcher from './rn-redux-image-prefetch'

const logger = createLogger({
  diff: true,
  level: 'debug',
  collapsed: true
});

const middlewares = [
  createActionBuffer('EX_NAVIGATION.INITIALIZE'),
  thunk,
  promiseMiddleware(),
  throttleActions(['UPDATE_USER'], 5000, {leading: true, trailing: false }),
  throttleActions(['EX_NAVIGATION.PUSH'], 700, {leading: true, trailing: false }),
  throttleActions(['OPEN_PROFILE'], 800, {leading: true, trailing: false }),
  throttleActions(['GET_POTENTIALS'], 1000, {leading: true, trailing: false }),
  // createPrefetcher({
  //   watchKeys: [
  //     {
  //       'GET_POTENTIALS_FULFILLED': {
  //         key: 'matches',
  //         location: {
  //           user: {
  //           image_url: true
  //         }
  //       }
  //     }
  //   }

    // ]
  // })
]

function configureStore(initialState = ({})) {
  if(global.__DEV__) {
    const store = createNavigationEnabledStore(createStore)(
        createReducer(),
        initialState,
        compose(
          applyMiddleware(...middlewares, logger),
          autoRehydrate(),
          global.reduxNativeDevTools ? global.reduxNativeDevTools({
            getMonitor: (monitor) => { global.isMonitorAction = monitor.isMonitorAction; },
            actionCreators: ActionMan
          }) : f => f,
        ),

      );

    persistStore(store, {
      storage: AsyncStorage, blacklist: ['navigation', 'ui']
    })
    // .purge(['navigation','appNav'])
  //   storage: AsyncStorage, blacklist: ['ui', 'potentials']
  // }).purge([])

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
    persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['navigation', 'ui']
    })
    return store
  }
}

module.exports = configureStore;
