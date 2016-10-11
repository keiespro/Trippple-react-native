import Promise from 'bluebird'
import { AsyncStorage,Platform } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import Keychain from 'react-native-keychain'
import config from '../../config'
const iOS = Platform.OS == 'ios';

const {KEYCHAIN_NAMESPACE} = config

const ClearAsyncStorage = Promise.promisify(AsyncStorage.clear)


function Logout(){
    console.log('log out');
    return Promise.all([
        iOS ? Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE) : null,
        ClearAsyncStorage().then(()=>{
            LoginManager.logOut()

        }).catch(err => console.log(err)),
    ])

}

export default Logout
