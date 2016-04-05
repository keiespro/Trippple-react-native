import {NativeModules} from 'react-native'
const {DeviceUtil} = NativeModules

export default {
  uuid: DeviceUtil.identifierForVendor,
  version: DeviceUtil.systemVersion,
  platform: DeviceUtil.systemName,
  model: DeviceUtil.model
}
