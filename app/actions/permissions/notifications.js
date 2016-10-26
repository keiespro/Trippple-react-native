import { PermissionsAndroid, Platform } from 'react-native'
import FCM from 'react-native-fcm';
import Promise from 'bluebird'
import OSPermissions from '../../../lib/OSPermissions/ospermissions'


export default {checkNotificationsPermission, requestNotificationsPermission}

export const checkNotificationsPermission = () => dispatch => dispatch({ type: 'CHECK_NOTIFICATIONS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(check)()
      .then(resolve)
      .catch(reject)
  }),
});

export const requestNotificationsPermission = () => dispatch => dispatch({ type: 'REQUEST_NOTIFICATIONS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(request)()
      .then(resolve)
      .catch(reject)
  }),
});

const request = {
  async ios(){
    let perm;
    try{
      const permission = await FCM.requestPermissions()
      if(permission){
        perm = 'true'
      }
    }catch(err){
      __DEV__ && console.warn(err)
      perm = 'denied';
      // throw new Error(err)
    }
    return permission;
  },
  android() {
    return new Promise((resolve,reject) => {
      resolve('true')
    })
  }
}

const check = {
  async ios(){
    let p;
    try{
      const permission = await OSPermissions.canUseNotifications()
      console.log(parseInt(permission));
      const permResult = Object.keys(permission).reduce((acc, el, i) => {
        acc += permission[el];
        return acc
      }, 0);

      // if(parseInt(permResult) > 2) {
      //   p = 'true'
      // }else
      if(parseInt(permResult) == 1) {
        console.log('no permission, must ask')
        p = 'true'
      }else{
        p = 'denied'
      }
    }catch(err){
      __DEV__ && console.warn(err);
      throw new Error(err)
    }
    return p
  },
  android() {
    return new Promise((resolve,reject) => {
      resolve('true')
    })
  }
}
