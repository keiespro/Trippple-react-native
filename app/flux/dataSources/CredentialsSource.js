import alt from '../alt'
var AppActions = require('../actions/AppActions')
import Keychain from 'react-native-keychain'

// import Promise from 'bluebird'

const KEYCHAIN_NAMESPACE =  'trippple.co'

const CredentialsSource = {
  init: {
    remote(state) {
      return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)

    },
    local(state){
      return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    },
    success: AppActions.gotCredentials,
    error: AppActions.noCredentials,

    shouldFetch(state) {
      return true
    },

  },
  // isLoading:
};

export default CredentialsSource

