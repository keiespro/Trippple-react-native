
import { NativeModules, NetInfo, AsyncStorage } from  'react-native'
import base64 from 'base-64'
import Analytics from './Analytics'
import AppInfo from 'react-native-app-info'
 import Promise from 'bluebird'
import Api from './api'
const { join, all } = Promise;


const { RNAppInfo,SettingsManager } = NativeModules
import DeviceInfo from './DeviceInfo'
class AppTelemetry{
  async getPayload(){


    var {
      displayName,
      bundleIdentifier,
      getInfoDeviceName,
      name,
      shortVersion,
      version
    } = RNAppInfo;

    const telemetryPayload = {
            DeviceInfo: DeviceInfo.get(),
            osSettings: SettingsManager.settings,

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
