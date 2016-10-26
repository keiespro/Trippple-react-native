
import { NativeModules,PermissionsAndroid } from 'react-native'
const NativeRCTOSPermissions = NativeModules.RCTOSPermissions;


const OSPermissions = {
  ...NativeRCTOSPermissions,
  canUseLocation(){
    return PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    .done()
  }
}

export default OSPermissions
