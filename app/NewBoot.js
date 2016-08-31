import App from './components/app';
import React, { Component } from 'react';
import {Settings} from 'react-native'
import {Provider} from 'react-redux';
import configureStore from './store';
import {persistStore} from 'redux-persist'
import ActionMan from  './actions/';
import loadSavedCredentials from './utils/Credentials'
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'

const store = configureStore();


class NewBoot extends Component{
  constructor(props){
    super()
    const settings = Settings._settings || {}
    this.state = {
      booted: false,
      isLocked: settings['LockedWithTouchID']
    }
  }
  componentWillMount(){
    if(this.state.isLocked){
      this.checkTouchId()
    }
  }

  componentDidMount(){
    initialize()
  }
  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
        this.setState({
          lockFailed: false,
          isLocked: false
        })
      })
      .catch(error => {
        Analytics.err(err)
        this.setState({
          lockFailed: true
        })
      });
  }

  render() {
    return (
      this.state.lockFailed ? <LockFailed retry={this.checkTouchId.bind(this)}/> : (
        this.state.isLocked ? <View/> : <Provider store={store}>
          <App/>
        </Provider>
      )
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
