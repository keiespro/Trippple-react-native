import AppInfo from 'react-native-app-info'
import { Platform, NativeModules } from 'react-native'
import CredentialsStore from '../flux/stores/CredentialsStore'
import Promise from 'bluebird'
import config from '../config'

const { FileTransfer, RNAppInfo } = NativeModules,
      UploadFile = Promise.promisify(FileTransfer.upload),
      { SERVER_URL } = config;

async function baseRequest(endpoint: '', payload: {}){
  const params = {
    method: 'post',
    headers: {
      'Accept':           'application/json',
      'Content-Type':     'application/json',
      'X-T3-Api-Version': 2,
      'X-T3-App-Version': AppInfo.getInfoShortVersion(),
      'X-T3-App-OS':      Platform.OS,
      'X-T3-App-Name':    RNAppInfo.name
    },
    body: JSON.stringify(payload)
  }

  let res = await fetch( `${SERVER_URL}/${endpoint}`, params)
  console.log(res)
  try{
    if(!res.json && res.status == 401){
        throw new Error()
    }
    let response = await res.json()
    console.log(response)
    return response
  }catch(err){
    console.error(err)

    return {error: err,status:res.status}
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
    const platform = require('Platform');
    const deviceInfo = require('./DeviceInfo')
    const payload = { pin, phone, device: deviceInfo.default }
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

  uploadImage(image, image_type, cropData){
    if(!image_type){
       image_type = 'profile'
    }
    return authenticatedFileUpload('upload', image, image_type, cropData)
            .then((res) => res.json())
            .catch((err) => {
              console.warn('err',{error: err})
            })
  },

  joinCouple(partner_phone){
    return authenticatedRequest('join_couple', { partner_phone })
  },

  getProfileSettingsOptions(){
    return publicRequest('get_client_user_profile_options')
  },

  sendContactsToBlock(data,start){
    return authenticatedRequest('process_phone_contacts', {data})
  },

  updatePushToken(push_token){
    return authenticatedRequest('update', { push_token })
  },

  disableAccount(){
    return authenticatedRequest('disable')
  },

  sendTelemetry(encodedTelemetryPayload){
    //  authenticatedRequest('telemetry',encodedTelemetryPayload).done()
  }


}

export default api
