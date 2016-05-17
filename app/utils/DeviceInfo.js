import {NativeModules} from 'react-native'
const {DeviceUtil} = NativeModules
console.log(DeviceUtil);
export default {
  name: DeviceUtil.name,
  uuid: DeviceUtil.identifierForVendor,
  version: DeviceUtil.systemVersion,
  platform: DeviceUtil.systemName,
  model: DeviceUtil.model
}
