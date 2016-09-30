import Keychain from 'react-native-keychain';
import config from '../../config';
import LogOut from '../utils/logout';
import { UIManager } from 'react-native';
import Telemetry from '../utils/AppTelemetry';

const { KEYCHAIN_NAMESPACE } = config;


export const saveCredentials = (credentials) => dispatch => dispatch({ type: 'SAVE_CREDENTIALS',
  payload: new Promise((resolve, reject) => {
    let { user_id, api_key } = credentials || global.creds;
    Keychain.setInternetCredentials(KEYCHAIN_NAMESPACE, `${user_id}`, api_key)
      .then(resolve).catch(reject);
  }),
});

export const logOut = () => dispatch => dispatch({ type: 'LOG_OUT',
  payload: new Promise((resolve, reject) => {
    LogOut().then(x => {
      global.creds = null;
      resolve(x);
    })
    .catch(reject);
  }),
});

export const screenshot = () => dispatch => dispatch({ type: 'CAPTURE_SCREENSHOT',
  payload: new Promise((resolve, reject) => {
    UIManager.takeSnapshot('window', { format: 'jpeg', quality: 0.8 })
      .then(resolve)
      .catch(reject);
  }),
});

export const sendTelemetry = () => dispatch => dispatch({ type: 'SEND_TELEMETRY',
  payload: new Promise((resolve, reject) => async() => {
    try {
      const Telemetry = await AppTelemetry.getEncoded();
      return resolve(await Api.sendTelemetry(Telemetry));
    } catch (err) {
      return reject(err);
    }
  }),
});
