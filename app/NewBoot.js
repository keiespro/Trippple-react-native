import App from './components/app';
import React, { Component } from 'react';

import { Provider } from 'react-redux';
import configureStore from './stores/store';

const store = configureStore();


class NewBoot extends Component {
    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

export default NewBoot
