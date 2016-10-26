import { PermissionsAndroid, Platform } from 'react-native'
import Contacts from 'react-native-contacts'
import Promise from 'bluebird'

const ContactGetter = Promise.promisifyAll(Contacts)

export default {checkContactsPermission, requestContactsPermission}

export const checkContactsPermission = () => dispatch => dispatch({ type: 'CHECK_CONTACTS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(check)()
      .then(resolve)
      .catch(reject)
  })
});

export const requestContactsPermission = () => dispatch => dispatch({ type: 'CHECK_CONTACTS_PERMISSION',
  payload: new Promise((resolve, reject) => {
    Platform.select(request)()
      .then(resolve)
      .catch(reject)
  }),
});

const request = {
  async ios(){
    const permission = await ContactGetter.requestPermission()
    let perm;
    try{
   // ContactGetter.PERMISSION_AUTHORIZED || ContactGetter.PERMISSION_UNDEFINED || ContactGetter.PERMISSION_DENIED
      if(permission === ContactGetter.PERMISSION_UNDEFINED){
        perm = 'unknown'
      }
      if(permission === ContactGetter.PERMISSION_AUTHORIZED){
        perm = 'true'
      }
      if(permission === ContactGetter.PERMISSION_DENIED){
        perm = 'denied'
      }
    }catch(err){
      __DEV__ && console.warn(err)
      throw new Error(err)
    }
    return perm
  },

  async android() {
    try{
      const params = [PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Privacy Settings',
        message: 'Hide from people in your contacts'
      }]
      const granted = await PermissionsAndroid.requestPermission(...params)
      return granted
    }catch(err) {
      console.warn(err)
      throw new Error(err)
    }
  }
}


const check = {
  async ios(){
    const permission = await ContactGetter.checkPermission()
    let perm;
    try{
   // ContactGetter.PERMISSION_AUTHORIZED || ContactGetter.PERMISSION_UNDEFINED || ContactGetter.PERMISSION_DENIED
      if(permission === ContactGetter.PERMISSION_UNDEFINED){
        perm = 'unknown'
      }
      if(permission === ContactGetter.PERMISSION_AUTHORIZED){
        perm = 'true'
      }
      if(permission === ContactGetter.PERMISSION_DENIED){
        perm = 'denied'
      }
    }catch(err){
      __DEV__ && console.warn(err)
      throw new Error(err)
    }
    return perm
  },

  async android() {
    try{
      const params = [PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Privacy Settings',
        message: 'Hide from people in your contacts'
      }]
      const granted = await PermissionsAndroid.checkPermission(...params)
      return granted
    }catch(err) {
      console.warn(err)
      throw new Error(err)
    }
  }
}
