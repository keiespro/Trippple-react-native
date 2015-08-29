import Device from 'react-native-device'


export default {
  uuid: Device.identifierForVendor,
  version: Device.systemVersion,
  platform: Device.systemName,
  model: Device.model
}

