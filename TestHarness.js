import React from "react";
import ReactNative, {View, AppRegistry,SnapshotViewIOS, Dimensions} from "react-native";
import path from 'path'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from './app/utils/colors'

global.__TEST__ = true;
__TEST__ = true;

const ScreensList = [
require('./app/components/welcome/intro'),
require('./app/components/welcome/auth'),
require('./app/components/pin'),
require('./app/components/settings'),
require('./app/components/SettingsBasic'),
require('./app/components/SettingsPreferences'),
require('./app/components/SettingsSettings'),
require('./app/components/SettingsCouple'),
require('./app/components/potentials'),
require('./app/components/potentials/PotentialsPlaceholder'),
require('./app/components/matches'),
require('./app/components/chat'),
require('./app/screens/CheckMark'),
require('./app/screens/ImageFlagged'),
require('./app/screens/SelectImageSource'),
require('./app/screens/MaintenanceScreen'),
require('./app/screens/registration/facebook'),
require('./app/screens/registration/bday'),
require('./app/screens/registration/gender'),
require('./app/screens/registration/name'),
require('./app/screens/registration/privacy'),
require('./app/modals/ModalDirector'),
require('./app/modals/LocationPermission'),
require('./app/modals/PrivacyPermissions'),
require('./app/modals/NewNotificationPermissions'),
require('./app/modals/ReportModal'),
require('./app/modals/UnmatchModal'),
require('./app/modals/CameraPermissions'),
require('./app/modals/CameraRollPermissions'),
]

function TestHarness(initialProps){
  ScreensList.forEach(s => {
    let Screen = s.default ? s.default : s
    let name = Screen.displayName || null;
    console.log(Screen);
    if(!name){

      console.log('missing displayName for ',Screen);

    }else{

      console.log("Screen: "+name);
      const Snapshotter = (props => (
          <SnapshotViewIOS style={{backgroundColor:colors.outerSpace,height:DeviceHeight,width:DeviceWidth}}>
            <Screen
              {...initialProps}
              {...props}
              navigator={{
                getCurrentRoutes:()=>{return {}},
                pop:()=>{},
                replace:()=>{}
              }}
            />
          </SnapshotViewIOS>
      ));
      AppRegistry.registerComponent(name, () => Snapshotter);

    }
  });

  console.log("Registered Testable Components:", AppRegistry.getAppKeys());

}



export default TestHarness
