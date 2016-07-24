import React from "react";
import ReactNative, {View, AppRegistry, Dimensions, StyleSheet,Navigator} from "react-native";
import path from 'path'
import Snapshotter from './snapshotter'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import colors from './app/utils/colors'

global.__TEST__ = true;
__TEST__ = true;

global.__DEV__ = false;
__DEV__ = false;

global.__DEBUG__ = false;
__DEBUG__ = false;


const ScreensList = [
require('./app/components/welcome/intro'),
require('./app/components/welcome/auth'),
require('./app/components/welcome/pin'),
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

const DelayMap = {
  'potentialsplaceholder': 3000,
  'potentials': 3000,
  'intro': 3000,
  'register': 3000,
  'maintenancescreen': 3000
}

function TestHarness(initialProps){
  ScreensList.forEach(s => {
    const Screen = s.default || s;
    const name = Screen.displayName || null;

    if(!name){
      console.log('Missing displayName for ', Screen);
      return
    }

    const Snapshot = (props => (

        <Navigator
          renderScene={(route, navigator)=>{
            var navBar;
            const RouteComponent = route.component;

            if (route.navigationBar) {
              navBar = React.cloneElement(route.navigationBar, {
                navigator: navigator,
                route: route,
              });
            }

            return (
              <Snapshotter
                testIdentifier={name}
                style={styles.frame}
                delay={route.delay}
              >

                {route.id == 'settings' ? navBar : null}
                <RouteComponent
                  navigator={navigator}
                  route={route}
                  navBar={navBar}
                  {...route.passProps}
                />

                {route.id == 'potentials' || route.id == 'settings' || route.id == 'matches' ? null : navBar}
              </Snapshotter>
            )
          }}
          configureScene={route => (route && route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom)}
          initialRoute={{
            component: Screen,
            id: name.toLowerCase(),
            delay: DelayMap[name.toLowerCase()] || null,
            passProps: {
              ...initialProps,
              ...props,

            }
          }}
        />
    ));

    AppRegistry.registerComponent(name, () => Snapshot);

  })

  console.log("Registered Testable Components:", AppRegistry.getAppKeys());
}

const styles = StyleSheet.create({
  frame:{
    backgroundColor:colors.outerSpace,
    height:DeviceHeight,
    width:DeviceWidth
  }
})

export default TestHarness
