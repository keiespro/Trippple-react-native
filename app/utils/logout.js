import Promise from 'bluebird'
import { AsyncStorage } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import Keychain from 'react-native-keychain'
import config from '../../config'

const {KEYCHAIN_NAMESPACE} = config

const ClearAsyncStorage = Promise.promisify(AsyncStorage.clear)


function Logout(){
    console.log('log out');
    return Promise.all([
        Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE),
        ClearAsyncStorage().then(()=>{
            LoginManager.logOut()

        }).catch(err => console.log(err)),
    ])

}

export default Logout
