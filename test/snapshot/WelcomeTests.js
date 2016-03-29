/*
* @providesModule WelcomeTests
* @flow
*/

import React, { View, AppRegistry,NativeModules,SnapshotViewIOS,Dimensions,AlertIOS } from 'react-native'
const {TestModule} = NativeModules
import Welcome from './app/components/welcome'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width



class WelcomeTests extends React.Component{
  constructor(props){
    super()
  }
  componentDidMount(){
    if (!TestModule.verifySnapshot) {
        throw new Error('TestModule.verifySnapshot not defined.');
    }

    // setTimeout(()=>{
    //   TestModule.verifySnapshot((s)=>{TestModule.markTestPassed(s)});
    // },4000);

  }


  render(){
    return (
        <SnapshotViewIOS  testIdentifier={'WelcomeTests'}

        style={{width:DeviceWidth,height:DeviceHeight,overflow:'hidden'}}>
          <Welcome/>
        </SnapshotViewIOS>
      )
  }
}

WelcomeTests.displayName = 'WelcomeTests'
AppRegistry.registerComponent('WelcomeTests', () => WelcomeTests)
