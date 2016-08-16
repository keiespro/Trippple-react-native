
import { createStore, compose, applyMiddleware } from 'redux';
// import { fromJS } from 'immutable';
import createReducer from '../reducers';
import devTools from 'remote-redux-devtools';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';

const logger = createLogger({
  // stateTransformer: (state) => {
  //   let newState = {};
  //
  //   for (var i of Object.keys(state)) {
  //     if (Immutable.Iterable.isIterable(state[i])) {
  //       newState[i] = state[i].toJS();
  //     } else {
  //       newState[i] = state[i];
  //     }
  //   };
  //
  //   return newState;
  // }

});
// const middlewares = []
// middlewares.push(promiseMiddleware);
// middlewares.push(logger);
// middlewares.push(thunk);

function configureStore(initialState = ({})) {
  if (__DEV__) {
    // const createStoreWithMiddleware = applyMiddleware(devTools(),thunkMiddleware, promiseMiddleware())(createStore);
    // const store = createStoreWithMiddleware(createReducer(), initialState );

    const store = createStore(
      createReducer(),
      initialState,
      compose(
        applyMiddleware(thunkMiddleware, logger, promiseMiddleware()),
        devTools()
      )
    )
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept(() => {
        const nextRootReducer = require('../reducers/index').default;
        store.replaceReducer(nextRootReducer);
      });
    }
    return store
  } else {
    return createStore(createReducer(), initialState, compose(
      applyMiddleware(thunkMiddleware,promiseMiddleware())
    ));
  }
}

module.exports = configureStore;
