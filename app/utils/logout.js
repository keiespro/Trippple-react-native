import Promise from 'bluebird'
import { AsyncStorage, Platform, NativeModules } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import Keychain from 'react-native-keychain'
import config from '../../config'


const iOS = Platform.OS == 'ios';
const {FBLoginManager} = NativeModules
const {KEYCHAIN_NAMESPACE} = config


async function Logout(){
  // console.log('log out');
  global.creds = null;
  return await Promise.all([
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE),
    AsyncStorage.clear(),
    FBLoginManager.logOut()
  ])
}

export default Logout
