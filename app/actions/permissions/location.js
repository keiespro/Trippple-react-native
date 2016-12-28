import { PermissionsAndroid, Platform } from 'react-native'
import Promise from 'bluebird'
import Permissions from 'react-native-permissions'

const askLocation = Promise.promisify(global.navigator.geolocation.getCurrentPosition)

export default {checkLocationPermission, requestLocationPermission}

export const checkLocationPermission = () => dispatch => dispatch({ type: 'CHECK_LOCATION_PERMISSION',
  payload: new Promise((resolve, reject) => {
    console.log('checkLocationPermission', Platform.select(check));
    Platform.select(check)()
      .then(permission => {
        // dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_ON'})
        resolve(permission)
      })
      .catch(err => {
        // dispatch({type: 'TOGGLE_PERMISSION_SWITCH_LOCATION_OFF'})
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
        resolve(err)
      })
  }),
});

const request = {
  async ios(){
    const geo = await askLocation()
    return geo.coords;
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
      const permission = await Permissions.getPermissionStatus('location')
      console.log(permission);
      return permission

    }catch(err){
      // __DEV__ && console.warn(err);
      return err
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
