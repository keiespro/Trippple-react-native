import { createStore, compose, applyMiddleware } from 'redux';
import createReducer from '../reducers';
import devTools from 'remote-redux-devtools';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'

const logger = createLogger();
const middlewares = [thunkMiddleware, logger, promiseMiddleware()]

function configureStore(initialState = ({})) {
  if (__DEV__) {

    const store = createStore(
      createReducer(),
      initialState,
      compose(
        applyMiddleware(...middlewares),
        devTools(),
        autoRehydrate()
      )
    );
    if (module.hot) {
      module.hot.accept(() => {
        const nextRootReducer = require('../reducers/').default;
        store.replaceReducer(nextRootReducer());
      });
    }

    return store

  } else {

    return createStore(
      createReducer(),
      initialState,
      compose(
        applyMiddleware(...middlewares),
        autoRehydrate()
      )
    );

  }
}

module.exports = configureStore;
