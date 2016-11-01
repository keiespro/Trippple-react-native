import React, { Component } from 'react';
import {Settings, View, Platform} from 'react-native'
import TouchID from 'react-native-touch-id'
import firebase from 'rn-firebase-bridge';
import LockFailed from './components/LockFailed'
import AppContainer from './AppContainer'
import loadSavedCredentials from './utils/Credentials'
import configureStore from './store';
import {sessionAuth} from './actions/facebook'

const firebaseConfig = {
  APIKey: 'AIzaSyBZKzo_aVFz4ldw0bQ-8dJMe88xF0q0N9U',
  authDomain: 'trippple-93bbc.firebaseio.com',
  databaseURL: 'https://trippple-93bbc.firebaseio.com',
  googleAppID: '1:820434364878:android:839f5cd266b5f573'
};


const store = configureStore();
const iOS = Platform.OS == 'ios';

class NewBoot extends Component{

  state = {
    booted: false,
    locked: iOS ? Settings._settings.LockedWithTouchID : false,
    initialized: false
  };

  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }
    this.initialize()
  }

  initialize(){
    firebase.initializeApp(firebaseConfig, 'co.trippple', () => store.dispatch(sessionAuth()));

    loadSavedCredentials().then(creds => {
      if(creds){
        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})
      }else if(global.creds){
        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: global.creds})
      }
    })
    .catch(err => {
      __DEV__ && console.log('err', err);
    })
    .finally(() => {
      this.setState({initialized: true})
    })
  }
  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
        __DEV__ && console.log(success, 'success');

        this.setState({
          lockFailed: false,
          locked: false
        })
      })
      .catch(error => {
        __DEV__ && console.log('error', error);
        this.setState({
          lockFailed: true
        })
      });
  }

  render() {
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)}/> }

    return this.state.locked || !this.state.initialized ? <View/> : <AppContainer store={store} />
  }
}

export default NewBoot
