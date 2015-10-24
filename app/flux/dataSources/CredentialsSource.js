import alt from '../alt'
import AppActions from '../actions/AppActions'
import Keychain from 'react-native-keychain'

// import Promise from 'bluebird'

import {KEYCHAIN_NAMESPACE} from  '../../config'

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
