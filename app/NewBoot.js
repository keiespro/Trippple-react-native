import React, { Component } from 'react';
import {Settings,View,Platform} from 'react-native'
import ActionMan from './actions/';
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'
import AppContainer from './AppContainer'
import loadSavedCredentials from './utils/Credentials'
const iOS = Platform.OS == 'iOS';

class NewBoot extends Component{

  state = {
    booted: false,
    locked: iOS ? Settings._settings['LockedWithTouchID'] : false,
    initialized:false
  };

  initialize(){

    loadSavedCredentials().then(creds => {
      if(creds){
        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})
      }else if(global.creds){
        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: global.creds})
      }
    })
    .catch(err=>{
      console.log('err',err);
    })
    .finally(()=>{
      this.setState({initialized:true})
    })

  }
  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }
    this.initialize()

  }

  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {

        this.setState({
          lockFailed: false,
          locked: false
        })
      })
      .catch(error => {
        this.setState({
          lockFailed: true
        })
      });
  }

  render() {
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)}/> }

    return this.state.locked || !this.state.initialized ? <View/> : <AppContainer />
  }
}

export default NewBoot
