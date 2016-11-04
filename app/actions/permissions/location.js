import { PermissionsAndroid, Platform } from 'react-native'
import Promise from 'bluebird'
import OSPermissions from '../../../lib/OSPermissions/ospermissions'

const askLocation = Promise.promisify(global.navigator.geolocation.getCurrentPosition)

export default {checkLocationPermission, requestLocationPermission}

export const checkLocationPermission = () => dispatch => dispatch({ type: 'CHECK_LOCATION_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(check)()
      .then(permission => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
        resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
        reject(err)
      })
  }),
});

export const requestLocationPermission = () => dispatch => dispatch({ type: 'REQUEST_LOCATION_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(request)()
      .then(permission => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
        resolve(permission)
      })
      .catch(err => {
        dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
        reject(err)
      })
  }),
});

const request = {
  async ios(){
    let perm;
    try{
      const geo = await askLocation()
      if(geo && geo.coords){
        perm = 'true'
      }
    }catch(err){
      // __DEV__ && console.warn(err)
      perm = 'denied';
      // throw new Error(err)
    }
    return perm;
  },
  async android() {
    try{
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location',
          message: ''
        }
      )
      return granted
    }catch(err) {
      // console.warn(err)
      throw new Error(err)
    }
  }
}

const check = {
  async ios(){
    try{
      const permission = await OSPermissions.canUseLocation()
      if(parseInt(permission) > 2) {
        return 'true'
      }else if(parseInt(permission) === 0) {
        // console.log('no permission, must ask')
        return 'unknown'
      }else{
        return 'denied'
      }
    }catch(err){
      // __DEV__ && console.warn(err);
      throw new Error(err)
    }
  },
  async android() {
    try{
      const granted = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location',
          message: ''
        }
      )
      return granted
    }catch(err) {
      // console.warn(err)
      throw new Error(err)
    }
  }
}
