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
  require('./app/components/screens/welcome/intro'),
  require('./app/components/screens/welcome/auth'),
  require('./app/components/screens/welcome/pin'),
  require('./app/components/screens/settings/settings'),
  require('./app/components/screens/settings/SettingsBasic'),
  require('./app/components/screens/settings/SettingsPreferences'),
  require('./app/components/screens/settings/SettingsSettings'),
  require('./app/components/screens/settings/SettingsCouple'),
  require('./app/components/screens/potentials/potentials'),
  require('./app/components/screens/potentials/PotentialsPlaceholder'),
  require('./app/components/screens/matches/matches'),
  require('./app/components/screens/chat/chat'),
  require('./app/components/screens/ImageFlagged'),
  require('./app/components/screens/MaintenanceScreen'),
  require('./app/components/modals/ModalDirector'),
  require('./app/components/modals/LocationPermission'),
  require('./app/components/modals/PrivacyPermissions'),
  require('./app/components/modals/NewNotificationPermissions'),
  require('./app/components/modals/ReportModal'),
  require('./app/components/modals/UnmatchModal')
];

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
