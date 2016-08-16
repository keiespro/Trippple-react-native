import {Platform} from 'react-native'
import Keychain from 'react-native-keychain'
import config from './app/config'
import Promise from 'bluebird'
const {KEYCHAIN_NAMESPACE} = config



function loadSavedCredentials(){

  if(Platform.OS == 'ios'){
    return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
  }else{
    return new Promise((reject,resolve)=>{
      resolve()
    })
  }

}


export default loadSavedCredentials
