
import { NativeModules,PermissionsAndroid } from 'react-native'
const NativeRCTOSPermissions = NativeModules.RCTOSPermissions;


const OSPermissions = {
  ...NativeRCTOSPermissions,
  canUseLocation(cb){
    PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    .then(result => {cb(result)})
    .catch(err => {cb(err)})
    .done()
  }
}

export default OSPermissions
