
import { NativeModules } from 'react-native'

const NativeRCTOSPermissions = NativeModules.RCTOSPermissions;


const OSPermissions = {
  ...NativeRCTOSPermissions,
  canUseLocation(cb){
    return cb(false)
  }
}
export default OSPermissions
