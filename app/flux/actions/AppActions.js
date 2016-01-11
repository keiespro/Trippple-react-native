import alt from '../alt'
import UserActions from './UserActions'
import { NativeModules } from  'react-native'
import base64 from 'base-64'
import Log from '../../Log'
import AppInfo from 'react-native-app-info'
import DeviceInfo from 'react-native-device'
const { RNAppInfo,SettingsManager } = NativeModules

class AppActions {
  gotCredentials(creds) {
    return (dispatch) => {
      dispatch(creds)
    }
  }
  noCredentials(err) {
    return (dispatch) => {
      dispatch(err)
    };
  }
  remoteFail(){
    return true
  }
  loadingUser(){
    return true
  }
  showCheckmark(copy){
    return copy || '';
  }
  hideCheckmark(){
    return true
  }
  updateRoute(d){
    return d;
  }
  toggleOverlay(){
    return true
  }
  storeContactsToBlock(contacts){
    return contacts;
  }
  grantPermission(perm){
    return perm;
  }
  denyPermission(perm){
    return perm;
  }
  saveStores() {
    return (dispatch) => {
      dispatch(true);
    };
  }
  sendTelemetry(){
    return (dispatch) => {
      var snapshot = alt.takeSnapshot(),
          appInfo = {
            displayName,
            bundleIdentifier,
            getInfoDeviceName,
            name,
            shortVersion,
            version
          } = RNAppInfo,
          telemetryPayload = {
            user: this.props.user,
            DeviceInfo,
            osSettings: SettingsManager.settings,
            state: JSON.parse(snapshot),
            appInfo
          },
          encodedTelemetryPayload = base64.encode(unescape(encodeURIComponent(JSON.stringify(telemetryPayload))));

      Api.sendTelemetry(encodedTelemetryPayload)
      .then((res) => {
        Log(res);
        dispatch(res);
      }).catch((err) => {
        Log(err);
        dispatch(err);
      });
    }
  }
}

export default alt.createActions(AppActions)
