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

    console.log(creds);
    const a = s.auth
    const f = s.fbUser

    if(!creds){
      if(a.api_key){
        console.log(a);
        this.performInitActions()

        s.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: a})

        return a
      }else if(f.userID){
            s.dispatch(ActionMan.loginWithFacebook())
          return
        }else{
          return false
        }
    }else{
      s.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})
      this.performInitActions()

    }
    return creds
  })
  .catch(err=>{

    console.log('err',err);

    if(s.fbUser.userID){
      s.dispatch(ActionMan.loginWithFacebook())
    }
  })
}
