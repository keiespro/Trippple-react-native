import {Platform,AsyncStorage} from 'react-native'
import Keychain from 'react-native-keychain'
import config from './app/config'
import Promise from 'bluebird'
const {KEYCHAIN_NAMESPACE} = config

export default async function loadSavedCredentials(){

  if(Platform.OS == 'ios'){
    try{
      const creds = await Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
      global.creds = {
        api_key: creds.password,
        user_id: creds.username
      };
      return {status: true, creds}
    }catch(error){

      return {status: false, error}
    }
  }else{
    try{
      const creds = await AsyncStorage.getItem(`${KEYCHAIN_NAMESPACE}-info`)
      global.creds = creds
      return {status: true, creds}
    }catch(error){

      return {status: false, error}
    }
  }
}
