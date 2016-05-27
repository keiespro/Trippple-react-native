import {NativeModules} from 'react-native'
const {RNDeviceInfo} = NativeModules

const DeviceInfo = {
  uuid: RNDeviceInfo.uniqueId,
  version: RNDeviceInfo.systemVersion,
  platform: RNDeviceInfo.systemName,
  name: RNDeviceInfo.deviceName,
  locale: RNDeviceInfo.deviceLocale,
  country: RNDeviceInfo.deviceCountry
}

export default DeviceInfo
