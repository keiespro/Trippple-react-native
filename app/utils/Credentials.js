import {Platform, AsyncStorage} from 'react-native'
import Keychain from 'react-native-keychain'
import config from '../../config'

const {KEYCHAIN_NAMESPACE} = config

export default async function loadSavedCredentials(){

  if(global.creds){
    return global.creds
  }
  if(Platform.OS == 'ios'){

    try{
      const creds = await Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
      return {status: true, creds}
    }catch(error){

      return null
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
