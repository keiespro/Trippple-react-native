import alt from '../alt'
var AppActions = require('../actions/AppActions')
import Keychain from 'react-native-keychain'

// import Promise from 'bluebird'

const KEYCHAIN_NAMESPACE =  'trippple.co'
console.log(AppActions)
const CredentialsSource = {
  init: {
    remote(state) {
      console.log(state)
      return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)

    },
    local(state){

      return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)

    },
    success: AppActions.gotCredentials,
    error: AppActions.noCredentials,

    shouldFetch(state) {
      console.log(state)
      return true
    },
    // interceptResponse(data, action, args){
    //   console.log(data, action, args)
    //   AppActions.gotCredentials( data )
    // }

  },
  // isLoading:
};

export default CredentialsSource

