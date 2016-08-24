
import {AsyncStorage} from 'react-native'
import Keychain from 'react-native-keychain'
import Promise from 'bluebird'
import config from '../../config'
const {KEYCHAIN_NAMESPACE} = config
const ClearAsyncStorage = Promise.promisify(AsyncStorage.clear)
import {LoginManager} from 'react-native-fbsdk'

export const saveCredentials = c => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: new Promise((resolve, reject) => {
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, c.user_id+'' , c.api_key)
      .then(x => resolve(x)).catch(x => reject(x))
  })
});


export const logOut = c => dispatch => dispatch({ type: 'LOG_OUT',
  payload: new Promise((resolve, reject) => {
    LoginManager.logOut();
    Promise.all([
      Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE),
      ClearAsyncStorage(),
    ])
    .then(x => {
      global.creds = null;
      resolve(x)
    })
    .catch(x => reject(x))

  })
});
