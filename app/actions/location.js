import { Alert, NativeModules, PushNotificationIOS } from 'react-native';

const { OSPermissions, RNMessageComposer, RNMail } = NativeModules;

const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  maximumAge: 1,
};

export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      global.navigator.geolocation.getCurrentPosition(resolve, reject, LOCATION_OPTIONS);
    }),
  },
});

export const checkLocation = () => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: new Promise((resolve, reject) => {
    OSPermissions.canUseLocation(OSLocation => {
      const perm = parseInt(OSLocation) > 2;
      if (perm) {
        dispatch(getLocation());
      } else if (parseInt(OSLocation) === 0) {
        dispatch({ type: 'UNASKED_LOCATION' });
      } else {
        reject(new Error('nopermission'));
      }
    });
  }),
});
