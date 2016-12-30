import Promise from 'bluebird'
import { AsyncStorage,Platform,NativeModules } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import Keychain from 'react-native-keychain'
import config from '../../config'
const iOS = Platform.OS == 'ios';
const {FBLoginManager} = NativeModules
const {KEYCHAIN_NAMESPACE} = config

const ClearAsyncStorage = Promise.promisify(AsyncStorage.clear)


function Logout(){
    // console.log('log out');
    return Promise.all([
        iOS ? Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE) : null,
        ClearAsyncStorage(),
        FBLoginManager.logOut(),
    ])

}

export default Logout
