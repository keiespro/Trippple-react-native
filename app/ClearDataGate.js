import React, { Component } from 'react';
import {Settings, View, Platform} from 'react-native'
import UserDefaults from 'react-native-userdefaults-ios'
import LogOut from './utils/logout'
import NewBoot from './NewBoot'

const iOS = Platform.OS == 'ios';

class ClearDataGate extends Component{

  state = {
    noReset: false
  };

  componentWillMount(){
    UserDefaults.boolForKey('ResetDataOnLaunch')
      .then(ResetDataOnLaunch => {
        __DEV__ && console.log('ResetDataOnLaunch', ResetDataOnLaunch)

        if(ResetDataOnLaunch){

          return LogOut().then(() => UserDefaults.setBoolForKey(false,'ResetDataOnLaunch'))
          .then(result => {
            __DEV__ && console.log(result);
          })
        }else{
          this.setState({noReset: true})
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({noReset: true})
      })
  }

  render() {
    return this.state.noReset ? <NewBoot /> : <View/>
  }
}

export default ClearDataGate
