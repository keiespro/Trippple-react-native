/* @flow */

import AppInfo from 'react-native-app-info'
import { Platform, NativeModules } from 'react-native'
import CredentialsStore from '../flux/stores/CredentialsStore'
import Promise from 'bluebird'
import AppActions from '../flux/actions/AppActions'
import config from '../config'
import DeviceInfo from './DeviceInfo'
import Analytics from './Analytics'

const { FileTransfer, RNAppInfo } = NativeModules,
      { SERVER_URL } = config;
const VERSION = "2.4.2",
      iOSversion = RNAppInfo.getInfoiOS;

async function baseRequest(endpoint='': String, payload={}: Object){
  const params = {
    method: 'post',
    headers: {
      'Accept':           'application/json',
      'Content-Type':     'application/json',
      'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
    },
    body: JSON.stringify(payload)
  }
  if(__DEBUG__ && window && window.__SHOW_ALL__) console.log(`API REQUEST ---->>>>> ${endpoint} | `,params);
  const url = `${SERVER_URL}/${endpoint}`;
  // var timeStarted = new Date();
  const res = await fetch(url, params)

  try{
    // var secondsAgo = ((new Date).getTime() - timeStarted.getTime()) / 1000;
    // Analytics.timeEnd(`Endpoint Perf`, {name:`${endpoint} ${secondsAgo}`})

    if(res.status == 504 || res.status == 502){
      __DEV__ && console.log('show maintenance screen')
      AppActions.showMaintenanceScreen();
      Analytics.err(res)
      throw new Error('Server down')

    }else if(!res.json && res.status == 401){
      Analytics.err(res)

      throw new Error('Unauthorized')
    }
    if(!res.json){
      __DEV__ && console.warn('no res.json')
    }
    __DEV__ && console.log(res);
    let response = await res.json()

    return Promise.try(() => {
      __DEV__ && console.log(`API RESPONSE <<<<<<---- ${endpoint} | `,response)
      return  {...response, res: response}
    }).catch((err)=>{
      throw new Error({error:err})
    })

  }catch(err){
    __DEV__ && console.warn('CAUGHT ERR',JSON.stringify(err, null, 2))

    return {error: err, status: res.status}
  }
}

function publicRequest(endpoint, payload){
  return baseRequest(endpoint, payload)
}

function authenticatedRequest(endpoint: '', payload: {}, forceCredentials){
  const credentials = forceCredentials || CredentialsStore.getCredentials();
  const authPayload = {...payload, ...credentials};
  return baseRequest(endpoint, authPayload)
}

 function authenticatedFileUpload(endpoint, image, image_type, cropData,callback){

  const credentials = CredentialsStore.getState()
  const uploadUrl = `${SERVER_URL}/${endpoint}`
  const uri =  image.hasOwnProperty('uri') ? image.uri : image

  if(!image_type){
    image_type = 'avatar'
  }
  // const imgUpload = await UploadFile({
  //   uri: uri,
  //   uploadUrl: uploadUrl,
  //   fileName: 'file.jpg',
  //   mimeType:'jpeg',
  //   data: { ...credentials, image_type, ...cropData }
  // })
  //
  // try{
  //   return await imgUpload
  // }catch(err){
  //   return err
  // }

  FileTransfer.upload({
    uri: uri,
    uploadUrl: uploadUrl,
    fileName: 'file.jpg',
    mimeType:'jpeg',
    data: { ...credentials, image_type, ...cropData }
  },(err,imgUpload)=>{
    __DEV__ && console.log(err,imgUpload)
    callback(err,imgUpload)
  });


}


const api = {

  requestPin(phone){
    return publicRequest('request_security_pin', { phone })
  },

  verifyPin(pin,phone){
    const payload = { pin, phone, device: DeviceInfo.get(), platform: Platform.OS || 'iOS' }
    return publicRequest('verify_security_pin', payload);
  },

  fbLogin(fbAuth,fbUser){
    const payload = {
      fb_oauth_code: fbAuth.accessToken,
      fb_user_id: fbAuth.userID,
      device: DeviceInfo.get(),
      platform: Platform.OS || 'iOS',
      fbUserData: fbUser
    }
    return publicRequest('fb_login', payload);
  },

  updateUser(payload){
    return authenticatedRequest('update', payload)
  },

  getUserInfo(creds){
    return authenticatedRequest('info',{},creds)
  },

  getMatches(page){ //v2 endpoint
    return authenticatedRequest('getMatches', {page})
  },


  getNewMatches(page){ //v2 endpoint
    return authenticatedRequest('getNewMatches', {page})
  },

  getFavorites(page){ //v2 endpoint
    return authenticatedRequest('getFavourites', {page})
  },

  toggleFavorite(match_id){ //v2 endpoint
    return authenticatedRequest('toggleMatch', {match_id})
  },

  unMatch(match_id){
    return authenticatedRequest('unmatch', {match_id})
  },

  reportUser(to_user_id, to_user_type, reason){
    return authenticatedRequest('report_user', {
      report_id: to_user_id,
      report_object: to_user_type,
      report_action: reason,
      to_user_id, // legacy ?
      to_user_type, // legacy ?
      reason // legacy ?
    })
  },

  getNotificationCount(){
    return authenticatedRequest('notification_totals', {})
  },

  getMessages(payload){
    if(!payload.match_id){ return false }
    return authenticatedRequest('messages', {...payload, message_type: 'retrieve'})
  },

  createMessage(message, matchID){
    const payload = {
      'message_type':'create',
      'match_id': matchID,
      'message_body': message,
    };
    return authenticatedRequest('messages', payload)
  },

  getPotentials(coordinates){
    return authenticatedRequest('potentials',{...coordinates})
  },

  sendLike(like_user_id,like_status,like_user_type,from_user_type){
  // fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type, from_user_type })
  },

  saveFacebookPicture(photo) {
    return publicRequest('save_facebook_picture', photo);
  },

  uploadImage(image, image_type: 'profile', cropData, callback){
    return authenticatedFileUpload('upload', image, image_type, cropData,callback)
  },

  joinCouple(partner_phone): Promise{
    return authenticatedRequest('join_couple', { partner_phone })
  },

  decouple(): Promise{
    return authenticatedRequest('decouple', {})
  },

  getCouplePin(): Promise{
    return authenticatedRequest('couple_pin', { "pin_action": "request" })
  },

  verifyCouplePin(partner_pin): Promise{
    return authenticatedRequest('couple_pin', { "pin_action": "verify", pin: partner_pin })
  },

  getProfileSettingsOptions(): Promise{
    return publicRequest('get_client_user_profile_options')
  },

  sendContactsToBlock(data): Promise{
    return authenticatedRequest('process_phone_contacts', {data})
  },

  updatePushToken(push_token): Promise{
    return authenticatedRequest('update', { push_token })
  },

  disableAccount(): Promise{
    return authenticatedRequest('disable')
  },

  async sendTelemetry(encodedTelemetryPayload: String): Promise{
    const credentials = CredentialsStore.getCredentials();
    const authPayload = { ...credentials};
    const params = {
      method: 'post',
      headers: {
        'Accept':           'application/json',
        'Content-Type':     'application/x-www-form-urlencoded',
        'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
      },
      body: encodedTelemetryPayload
    }

    let res = await fetch( `${SERVER_URL}/telemetry`, params)

    try{
      if(!res.json && res.status == 401){
        throw new Error('NO JSON')
      }
      let response = await res.json()
      __DEV__ && console.log(response)
      return response
    }catch(err){
      __DEV__ && console.error(err)

      return {error: err,status:res.status}
    }

  }


}

export default api
