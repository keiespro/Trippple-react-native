import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import throttleActions from 'redux-throttle-actions';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate, } from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'

import { createNavigationEnabledStore } from '@exponent/ex-navigation'
import ActionMan from './actions/'
import createReducer from './reducers/';
import createPrefetcher from './rn-redux-image-prefetch'
import { composeWithDevTools } from 'redux-devtools-extension'

const logger = createLogger({
  diff: true,
  level: 'debug',
  collapsed: true
});

const middlewares = [
  thunk,
  promiseMiddleware(),
  // createActionBuffer(REHYDRATE),
  createActionBuffer('EX_NAVIGATION.INITIALIZE'),
  // throttleActions(['UPDATE_USER'], 2000, {leading: true, trailing: false }),
  // throttleActions(['EX_NAVIGATION.PUSH'], 700, {leading: true, trailing: false }),
  throttleActions(['OPEN_PROFILE','CLOSE_PROFILE'], 300, {leading: true, trailing: false }),
  throttleActions(['GET_POTENTIALS'], 1000, {leading: true, trailing: false }),
  createPrefetcher({
    watchKeys: [
      {
        'GET_POTENTIALS_FULFILLED': {
          key: 'matches',
          location: {
            user: {
            image_url: true
          }
        }
      }
    }

    ]
  })
]

function configureStore(initialState = ({})) {
  if(global.__DEV__) {
    const bak = global.XMLHttpRequest;
      const xhr = global.originalXMLHttpRequest ?
        global.originalXMLHttpRequest :
        global.XMLHttpRequest;

      global.XMLHttpRequest = xhr;
      //

      const comp = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionCreators: ActionMan,
        maxAge: 200,
      }) : compose

    const store = createNavigationEnabledStore(createStore)(
        createReducer(),
        comp(
          autoRehydrate({log: true}),
          applyMiddleware(...middlewares),//logger
        ),///,

      );


  //   storage: AsyncStorage, blacklist: ['ui', 'potentials']
  // }).purge([])
    //
    const persistor = persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['navigation', 'appNav', 'ui', 'potentials']
    })
    persistor.purge(['navigation','appNav','potentials'])

    // AsyncStorage.getAllKeys().then(k => {
    //   console.log(k);
    //   AsyncStorage.multiGet(k).then(r => {
    //     console.log(r)
    //     persistor.rehydrate(r)
    //
    //   })
    // })

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
        autoRehydrate(),
        applyMiddleware(...middlewares),
      )
    );
    persistStore(store, {
      storage: AsyncStorage,
      blacklist: ['navigation', 'ui', 'potentials']
    })
    return store
  }
}

module.exports = configureStore;
