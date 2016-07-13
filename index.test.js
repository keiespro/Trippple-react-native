import React from 'react'

import { AppRegistry, SnapshotViewIOS, NativeModules } from 'react-native';

import Settings from 'app/components/settings'
import Welcome from 'app/components/welcome'
import Boot from 'app/Boot'
import Trippple from 'index.ios'
import AppTest from 'app/components/app-test'

import Keychain from 'react-native-keychain'
const KEYCHAIN_NAMESPACE = "http://api2.trippple.co"
const MOCK_CREDENTIALS = {
  user_id: '62',
  api_key: '247aba58-e3cb-49c9-a418-24b3f1dac7ef'
}
/**
 * Require here every single component you would like
 * to test
 */
const TO_TEST = [ AppTest ];

console.log('FILE LOAD')


    /**
     * Register every test component
     */
    // TO_TEST.forEach(Component => {
      console.log(AppTest)
      /**
       * We have to wrap every component in a `SnapshotViewIOS`
       * so that our test suite knows when the screen has been captured
       * and suite is finished.
       *
       * We also pass `initialProps` down so we can manipulate the
       * component apperance from the test suite
       */
      const Snapshotter = (props) => (
        <SnapshotViewIOS>
          <AppTest {...props} />
        </SnapshotViewIOS>
      );

      /**
       * Register every component by its displayName we will refer from the test
       * suite
       */
      AppRegistry.registerComponent("AppTest", () => Snapshotter);
    // });


  // Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, ...MOCK_CREDENTIALS)
  //   .then((result)=> { })
  //   .catch((err)=> {
  //     console.log(err)
  //     console.log('ERROR SETTING KEYCHAIN CREDS')
  //   });
