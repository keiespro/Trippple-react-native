import App from './components/app';
import React, { Component } from 'react';
import {AsyncStorage} from 'react-native'
import { Provider } from 'react-redux';
import configureStore from './stores/store';
import {persistStore} from 'redux-persist'

const store = configureStore();

persistStore(store, {storage: AsyncStorage})

class NewBoot extends Component {
    render() {
      return (
        <Provider store={store}>
          <App store={store}/>
        </Provider>
      );
    }
  }

export default NewBoot
