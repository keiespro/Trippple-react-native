/*
* @providesModule SettingsTests
*/

const MOCK_CREDENTIALS = {
  user_id: '26158',
  api_key: '5041eb3c-3e0e-449e-8298-420a8fb28dae'
}

const KEYCHAIN_NAMESPACE = 'http://api2.trippple.co'

import React from "react";
import {View, AppRegistry, NativeModules, SnapshotViewIOS, Dimensions, AlertIOS} from "react-native";
import Keychain from 'react-native-keychain'
const {TestModule} = NativeModules
import Settings from '../../app/components/settings'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width



class SettingsTests extends React.Component{
  constructor(props){
    super()
  }
  componentWillMount(){
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, ...MOCK_CREDENTIALS)
      .then((result)=> {
      })
      .catch((err)=> {
      });
  }

  render(){
    return (
        <SnapshotViewIOS
          testIdentifier={'SettingsTests'}
          style={{width:DeviceWidth,height:DeviceHeight,overflow:'hidden'}}
        >
          <Settings user={{}} />
        </SnapshotViewIOS>
      )
  }
}

SettingsTests.displayName = 'SettingsTests'
AppRegistry.registerComponent('SettingsTests', () => SettingsTests)
