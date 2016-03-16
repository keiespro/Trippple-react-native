import alt from './flux/alt'
import { NativeModules, NetInfo, AsyncStorage } from  'react-native'
import base64 from 'base-64'
import Analytics from './utils/Analytics'
import AppInfo from 'react-native-app-info'
import DeviceInfo from 'react-native-device'
import Promise from 'bluebird'
import Api from './utils/api'
const { join, all } = Promise;

const Geo = Promise.promisifyAll(navigator.geolocation)

const { RNAppInfo,SettingsManager } = NativeModules

class AppTelemetry{
  async getPayload(){
    var snapshot = alt.takeSnapshot();

    var {
      displayName,
      bundleIdentifier,
      getInfoDeviceName,
      name,
      shortVersion,
      version
    } = RNAppInfo;

    const telemetryPayload = {
            DeviceInfo,
            osSettings: SettingsManager.settings,
            state: JSON.parse(snapshot),
            appInfo: {
              displayName,
              bundleIdentifier,
              getInfoDeviceName,
              name,
              shortVersion,
              version
            },
    };

    try{
      return tele = {...telemetryPayload, netInfo: {connection: await NetInfo.fetch() } };
    }catch(x){
      Analytics.log(x)
      return x
    }
  }

  async getEncoded(){
    try{
      const payload = await this.getPayload()
      return await base64.encode(unescape(encodeURIComponent(JSON.stringify(payload))));

    }catch(err){
      Analytics.log(err)
      return err
    }


  }
}

export default new AppTelemetry
