import { Alert, NativeModules,Platform } from 'react-native'
import api  from '../utils/api'

const {  RNMessageComposer, RNMail } = NativeModules;
import OSPermissions from '../../lib/OSPermissions/ospermissions'
const iOS = Platform.OS == 'ios';

const LOCATION_OPTIONS = {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000} 


export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      global.navigator.geolocation.getCurrentPosition((geo => {
        console.log(geo);
        if(geo && geo.coords){
          api.updateUser(geo.coords).then(()=>{resolve(geo.coords)})

        }
      }), (err => {
        __DEV__ && console.log(err,'LOCATION ERR');
          reject(err)
      }), LOCATION_OPTIONS);
    }).catch(err => {
      __DEV__ && console.warn(err,'LOCATION ERR');

    })
  },
});

export const checkLocation = () => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: new Promise((resolve, reject) => {
    OSPermissions.canUseLocation(OSLocation => {
      const perm = iOS ? parseInt(OSLocation) > 2 : OSLocation;
      if (perm) {
        resolve(dispatch(getLocation()));
      } else if (iOS && parseInt(OSLocation) === 0) {
          console.log('no permission, must ask')
        // dispatch({ type: 'UNASKED_LOCATION' });
      } else {
        reject(new Error('nopermission'));
      }
    });
  }),
});
