import Keychain from 'react-native-keychain'
import config from '../../config'
const {KEYCHAIN_NAMESPACE} = config
import LogOut from '../utils/logout'

export const saveCredentials = c => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: new Promise((resolve, reject) => {
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, c.user_id+'' , c.api_key)
      .then(x => resolve(x)).catch(x => reject(x))
  })
});


export const logOut = c => dispatch => dispatch({ type: 'LOG_OUT',
  payload: new Promise((resolve, reject) => {
    LogOut()
    .then(x => {
      global.creds = null;
      resolve(x)
    })
    .catch(x => {
      console.log(x)
      reject(x)
    })

  })
});
