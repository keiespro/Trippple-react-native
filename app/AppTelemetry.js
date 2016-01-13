import alt from './flux/alt'
import { NativeModules, NetInfo, AsyncStorage } from  'react-native'
import base64 from 'base-64'
import Log from './Log'
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
      var tele = await join( NetInfo.fetch(),AsyncStorage.getAllKeys()).done((results)=>{
        return ({...telemetryPayload, netInfo: {connection: results[0]},storageKeys: results[1]});
      });
      return tele

    }catch(x){
      console.warn(x)
      return x
    }
  }

  async getEncoded(){
    try{
      const payload = await this.getPayload()
      return base64.encode(unescape(encodeURIComponent(JSON.stringify(payload))));

    }catch(err){
      console.warn(err)

    }


  }
}

export default new AppTelemetry
