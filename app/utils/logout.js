import {AsyncStorage} from 'react-native'

import Promise from 'bluebird'
import Keychain from 'react-native-keychain'
import config from '../../config'

const {KEYCHAIN_NAMESPACE} = config

const ClearAsyncStorage = Promise.promisify(AsyncStorage.clear)

import {LoginManager} from 'react-native-fbsdk'


export default function Logout(){
  console.log('log out');
  return Promise.all([
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE),
    ClearAsyncStorage().catch(err => console.log(err)),
    LoginManager.logOut()
  ])

}
