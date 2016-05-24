import {NativeModules} from 'react-native'
const {DeviceUtil} = NativeModules

const DeviceInfo = {
  uuid: DeviceUtil.identifierForVendor,
  version: DeviceUtil.systemVersion,
  platform: DeviceUtil.systemName,
  model: DeviceUtil.model
}

__DEV__ && console.table && console.table(...DeviceInfo);
export default DeviceInfo
