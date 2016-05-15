/*
* @providesModule WelcomeTests
*/

import React from "react";

import {View, AppRegistry, NativeModules, SnapshotViewIOS, Dimensions, AlertIOS} from "react-native";
const {TestModule} = NativeModules
import Welcome from '../../app/components/welcome'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width



class WelcomeTests extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return (
        <SnapshotViewIOS
          testIdentifier={'WelcomeTests'}
          style={{width:DeviceWidth,height:DeviceHeight,overflow:'hidden'}}
        >
          <Welcome/>
        </SnapshotViewIOS>
      )
  }
}

WelcomeTests.displayName = 'WelcomeTests'
AppRegistry.registerComponent('WelcomeTests', () => WelcomeTests)
