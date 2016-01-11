import AppInfo from 'react-native-app-info'
import {Platform, NativeModules} from 'react-native'
const { FileTransfer, RNAppInfo } = NativeModules
import CredentialsStore from '../flux/stores/CredentialsStore'
// const UploadFile = Promise.promisify(FileTransfer.upload)
import config from '../config'

const { SERVER_URL } = config


function publicRequest(endpoint, payload){
  const req = {
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
    };
    return fetch( `${SERVER_URL}/${endpoint}`, req).then((res) => res).catch((err) => err)
}

 function authenticatedRequest(endpoint: '', payload: {}){
  const credentials = CredentialsStore.getCredentials()
  const authPayload = {...payload, ...credentials}
  console.warn('auth request '+endpoint);

  const req = {
      method: 'post',
      headers: {
        'Accept':           'application/json',
        'Content-Type':     'application/json',
        'X-T3-Api-Version': 2,
        'X-T3-App-Version': AppInfo.getInfoShortVersion(),
        'X-T3-App-OS':      Platform.OS,
        'X-T3-App-Name':    RNAppInfo.name
      },
      body: JSON.stringify(authPayload),
    };
    return fetch( `${SERVER_URL}/${endpoint}`, req).then((res)=>{

      console.warn('RRREESSS',res);
      return res.json()
    })

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
  }
  catch(err){
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

    console.warn('api.getuserinfo');
    return authenticatedRequest('info')
  },

  getMatches(page){
    console.warn('api.getmatches');
    return authenticatedRequest('getMatches', {page})
    //v2 endpoint
  },

  getFavorites(page){
    return authenticatedRequest('getFavourites', {page})
    //v2 endpoint
  },

  toggleFavorite(match_id){
    return authenticatedRequest('toggleMatch', {match_id})
    //v2 endpoint
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
    if(!payload.match_id){
      return false;
    }
    const outgoingPayload = payload;
    outgoingPayload.message_type = 'retrieve';
    return authenticatedRequest('messages', outgoingPayload)
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
  //
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
            .then((res)=> res.json().catch((err) => { return err }))
            .catch((err) => {
              console.warn('err',{error: err})
            })
  },

  sendContactsToBlock(data,start){
    return authenticatedRequest('process_phone_contacts', {data})
  },

  updatePushToken(push_token){
    return authenticatedRequest('update', { push_token })
  },

  disableAccount(){
    return authenticatedRequest('disable')
  }


}

export default api
