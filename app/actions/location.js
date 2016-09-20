import { Alert, NativeModules, PushNotificationIOS } from 'react-native'
import api  from '../utils/api'

const { OSPermissions, RNMessageComposer, RNMail } = NativeModules;

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  maximumAge: 1,
};

export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      global.navigator.geolocation.getCurrentPosition((geo => {

        if(geo && geo.coords){
          api.updateUser(geo.coords).then(()=>{resolve(geo.coords)})

        }
      }), (err => {
        __DEV__ && console.log(err,'LOCERRRRR');
          reject(err)
      }), LOCATION_OPTIONS);
    }).catch(err => {
      __DEV__ && console.log(err,'LOCERRRRR');
    })
  },
});

export const checkLocation = () => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: new Promise((resolve, reject) => {
    OSPermissions.canUseLocation(OSLocation => {
      const perm = parseInt(OSLocation) > 2;
      if (perm) {
        resolve(dispatch(getLocation()));
      } else if (parseInt(OSLocation) === 0) {
          console.log('no permission, must ask')
        // dispatch({ type: 'UNASKED_LOCATION' });
      } else {
        reject(new Error('nopermission'));
      }
    });
  }),
});
