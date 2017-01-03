import api from '../utils/api'

const LOCATION_OPTIONS = {enableHighAccuracy: false, timeout: 100000, maximumAge: 100000}


export const getLocation = () => dispatch => dispatch({ type: 'GET_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      global.navigator.geolocation.getCurrentPosition(geo => {
        if(geo && geo.coords){
          dispatch({ type: 'GOT_LOCATION', payload: geo.coords})
          return api.updateUser(geo.coords).then(() => { resolve(geo.coords) })
        }
        return false
      }, err => {
        __DEV__ && console.warn(err, 'LOCATION ERR');
        reject(err)
      }, LOCATION_OPTIONS);
    })
  },
});


export const checkLocation = () => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: new Promise((resolve, reject) => {

    Permissions.getPermissionStatus('location')
    .then(permission => {
      if(permission == 'authorized') {
        dispatch(getLocation());
        resolve()
      }else if(permission == 'undetermined') {
        reject()
      }else{
        reject(new Error('nopermission'));
      }
    });
  }),
});
