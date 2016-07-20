import React from "react";
import ReactNative, {View, AppRegistry, NativeModules,SnapshotViewIOS} from "react-native";
// const ScreensList = [
//   require('./app/components/pin'),
//   require('./app/screens/CheckMark'),
//   require('./app/components/welcome')
// ]
//
// console.log(ScreensList);
//
//
// ScreensList.forEach(Screen => {
//
//   console.log(Screen);
//   if(Screen.displayName) {
//     console.log(Screen.displayName);
//     const Snapshotter = (props => <SnapshotViewIOS><Screen {...props}/></SnapshotViewIOS>)
//     AppRegistry.registerComponent(Screen.displayName, () => Snapshotter);
//   }
// });


import path from 'path'
const ScreensList = [
require('./app/components/welcome'),
require('./app/components/login'),
require('./app/components/register'),
require('./app/components/pin'),
require('./app/components/settings'),
require('./app/components/SettingsBasic'),
require('./app/components/SettingsPreferences'),
require('./app/components/SettingsSettings'),
require('./app/components/SettingsCouple'),
require('./app/components/potentials'),
require('./app/components/potentials/PotentialsPlaceholder'),
require('./app/screens/CheckMark'),
require('./app/screens/ImageFlagged'),
require('./app/screens/SelectImageSource'),
require('./app/screens/MaintenanceScreen'),
require('./app/screens/registration/facebook'),
require('./app/screens/registration/bday'),
require('./app/screens/registration/gender'),
require('./app/screens/registration/name'),
require('./app/screens/registration/privacy'),

  // require('./components/pin'),
  // require('./screens/CheckMark'),
  // require('./components/welcome')
]






console.log(ScreensList);


ScreensList.forEach(s => {
  let Screen = s.default ? s.default : s
  let name = Screen.displayName || null;
  console.log(Screen);
  if(!name){

    console.log('missing displayName for ',Screen);

  }else{

    console.log("Screen: "+name);
    const Snapshotter = (props => (
        <SnapshotViewIOS>
          <Screen
            {...props}
            navigator={{
              getCurrentRoutes:()=>{return {}},
              pop:()=>{}
            }}
          />
        </SnapshotViewIOS>
    ));
    AppRegistry.registerComponent(name, () => Snapshotter);

  }
});

console.log(AppRegistry.getAppKeys());

class TestHarness extends React.Component{

  render(){
    console.log(this.props.children);
    return (
      <View>
        {this.props.children}
      </View>
    )
  }
}

export default TestHarness
