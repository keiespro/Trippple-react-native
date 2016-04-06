/* @flow */

import AppInfo from 'react-native-app-info'
import { Platform, NativeModules } from 'react-native'
import CredentialsStore from '../flux/stores/CredentialsStore'
import Promise from 'bluebird'
import AppActions from '../flux/actions/AppActions'
import config from '../config'
import deviceInfo from './DeviceInfo'

const { FileTransfer, RNAppInfo, ReactNativeAutoUpdater } = NativeModules,
      UploadFile = Promise.promisify(FileTransfer.upload),
      { SERVER_URL } = config;
const VERSION = ReactNativeAutoUpdater.jsCodeVersion,
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
  __DEBUG__ && console.log(params)

  let res = await fetch( `${SERVER_URL}/${endpoint}`, params)

  try{
    __DEBUG__ && console.log(res)

    if(res.status == 504 || res.status == 502 || res.status == 404){
      __DEBUG__ && console.log('show maint')
      AppActions.showMaintenanceScreen();
      throw new Error('Server down')

    }else if(!res.json && res.status == 401){
      throw new Error('Unauthorized')
    }
    if(!res.json){
      __DEBUG__ && console.log('no res.json')
    }
    let response = await res.json()
    response.res = res
    return response
  }catch(err){
    __DEBUG__ && console.log('CAUGHT ERR',response,res,err)

    return {error: err, status: res.status}
  }
}

function publicRequest(endpoint, payload){
  return baseRequest(endpoint, payload)
}

function authenticatedRequest(endpoint: '', payload: {}){
  const credentials = CredentialsStore.getCredentials();
  const authPayload = {...payload, ...credentials};
  return baseRequest(endpoint, authPayload)
}

async function authenticatedFileUpload(endpoint, image, image_type, cropData){

  const credentials = CredentialsStore.getState()
  const uploadUrl = `${SERVER_URL}/${endpoint}`
  const uri =  image.hasOwnProperty('uri') ? image.uri : image

  if(!image_type){
    image_type = 'avatar'
  }
  const imgUpload = await UploadFile({
    uri: uri,
    uploadUrl: uploadUrl,
    fileName: 'file.jpg',
    mimeType:'jpeg',
    data: { ...credentials, image_type, ...cropData }
  })

  try{
    return await imgUpload
  }catch(err){
    return err
  }
}


const api = {

  requestPin(phone){
    return publicRequest('request_security_pin', { phone })
  },

  verifyPin(pin,phone){
    const payload = { pin, phone, device: deviceInfo, platform: Platform.OS || 'iOS' }
    return publicRequest('verify_security_pin', payload);
  },

  updateUser(payload){
    return authenticatedRequest('update', payload)
  },

  getUserInfo(){
    return authenticatedRequest('info',{})
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
    return authenticatedRequest('potentials')
  },

  sendLike(like_user_id,like_status,like_user_type,from_user_type){
  // fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type, from_user_type })
  },

  saveFacebookPicture(photo) {
    return publicRequest('save_facebook_picture', photo);
  },

  uploadImage(image, image_type, cropData): Promise{
    if(!image_type){
      image_type = 'profile'
    }
    return authenticatedFileUpload('upload', image, image_type, cropData)
            .then((res) => {
              __DEBUG__ && console.log(res)
                // res.json()
            })
            .catch((err) => {
              __DEBUG__ && console.warn('upload err',{error: err})
            })
  },

  joinCouple(partner_phone): Promise{
    return authenticatedRequest('join_couple', { partner_phone })
  },

  getProfileSettingsOptions(): Promise{
    return publicRequest('get_client_user_profile_options')
  },

  sendContactsToBlock(data,start): Promise{
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
      __DEBUG__ && console.log(response)
      return response
    }catch(err){
      __DEBUG__ && console.error(err)

      return {error: err,status:res.status}
    }

  }


}

export default api
