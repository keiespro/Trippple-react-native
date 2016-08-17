import App from './components/app';
import React, { Component } from 'react';
import {AsyncStorage} from 'react-native'
import {Provider} from 'react-redux';
import configureStore from './stores/store';
import {persistStore} from 'redux-persist'
import ActionMan from  './actions/';
import loadSavedCredentials from '../Credentials'

const store = configureStore();

persistStore(store, {storage: AsyncStorage})

class NewBoot extends Component{
  componentDidMount(){
    initializeApp()
  }
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}

export default NewBoot

function initializeApp(){

  loadSavedCredentials().then(creds => {

    store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})

    const initActions = [
      'getUserInfo',
      'getFacebookInfo',
      'getPushToken'
    ];

    initActions.forEach(ac => {
      // console.log(ActionMan[ac]());
      store.dispatch(ActionMan[ac]())
    })
  })


}
