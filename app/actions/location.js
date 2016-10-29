import { Alert, Platform } from 'react-native'
import api from '../utils/api'
import checkLocationPermission from './permissions/location'

import OSPermissions from '../../lib/OSPermissions/ospermissions'

const iOS = Platform.OS == 'ios';

const LOCATION_OPTIONS = {enableHighAccuracy: false, timeout: 100000, maximumAge: 100000}


export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      global.navigator.geolocation.getCurrentPosition((geo => {
        if(geo && geo.coords){
          api.updateUser(geo.coords).then(() => { resolve(geo.coords) })
        }
      }), (err => {
        __DEV__ && console.warn(err, 'LOCATION ERR');
        reject(err)
      }), LOCATION_OPTIONS);
    })
  },
});

 //
// export const checkLocation = () => dispatch => dispatch({ type: 'CHECK_LOCATION',
//   payload: new Promise((resolve, reject) => {
//
//     OSPermissions.canUseLocation()
//     .then(OSLocation => {
//       const perm = iOS ? parseInt(OSLocation) > 2 : OSLocation;
//       if(perm) {
//         dispatch(getLocation());
//         resolve()
//       }else if(iOS && parseInt(OSLocation) === 0) {
//         console.log('no permission, must ask')
//         reject()
//       }else{
//         reject(new Error('nopermission'));
//       }
//     });
//   }),
// });
