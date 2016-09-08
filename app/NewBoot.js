import React, { Component } from 'react';
import {Settings,View} from 'react-native'
import ActionMan from  './actions/';
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'
import AppContainer from './AppContainer'

class NewBoot extends Component{

  state = {
    booted: false,
    locked: Settings._settings['LockedWithTouchID']
  };

  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }else{
      // this.initialize()
    }

  }

  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
        console.log(success);
        this.initialize()

        this.setState({
          lockFailed: false,
          locked: false
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
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)}/> }

    return this.state.locked ? <View/> : <AppContainer />
  }
}

export default NewBoot
