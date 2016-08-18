import App from './components/app';
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import configureStore from './stores/store';
import {persistStore} from 'redux-persist'
import ActionMan from  './actions/';
import loadSavedCredentials from '../Credentials'

const store = configureStore();


class NewBoot extends Component{
  componentDidMount(){
    initialize()
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

function initialize(){
  const s = store.getState();
  loadSavedCredentials().then(creds => {

    const a = s.auth
    const f = s.fbUser

    if(!creds){
      if(a.api_key){


        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: a})

        return a
      }else if(f.userID){
            store.dispatch(ActionMan.loginWithFacebook())
          return
        }else{
          return false
        }
    }else{
      store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})


    }
    return creds
  })
  .catch(err=>{

    console.log('err',err);

    if(s.fbUser.userID){
      store.dispatch(ActionMan.loginWithFacebook())
    }
  })
}
