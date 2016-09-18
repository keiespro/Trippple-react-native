import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from './reducers/';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import {AsyncStorage} from 'react-native'
import createActionBuffer from 'redux-action-buffer'
import throttleActions from "redux-throttle-actions";
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import {
  createNavigationEnabledStore,
} from '@exponent/ex-navigation'


const logger = createLogger({
  diff: true,
  level: 'log',
  collapsed: (s,action) => (!global.__DEBUG__ || action.type.indexOf('PENDING') > -1)
});

const middlewares = [
  thunk, 
  promiseMiddleware(), 
  createActionBuffer('EX_NAVIGATION.INITIALIZE'), 
  throttleActions(['EX_NAVIGATION.BATCH'], 500)
]

function configureStore(initialState = ({})) {
  if (__DEV__) {


    const store = createNavigationEnabledStore(createStore)(
      createReducer(),
      initialState,
      compose(
        autoRehydrate(),
        applyMiddleware(...middlewares, logger, ),
        global.reduxNativeDevTools ? global.reduxNativeDevTools(/*options*/) : devTools()
      )
    );
    global.reduxNativeDevTools && global.reduxNativeDevTools.updateStore(store);

    persistStore(store, {storage: AsyncStorage,blacklist:['navigation','ui','potentials']}).purge(['navigation'])

    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('./reducers/').default;
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
    persistStore(store, {storage: AsyncStorage, blacklist:['navigation','ui','potentials']})
    return store

  }
}

module.exports = configureStore;
