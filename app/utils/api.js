import { SERVER_URL } from '../config'
import AppInfo from 'react-native-app-info'
import Promise from 'bluebird'
import {Platform} from 'react-native'
import { FileTransfer } from 'NativeModules'

const CredentialsStore = require('../flux/stores/CredentialsStore')
const UploadFile = Promise.promisify(FileTransfer.upload)

async function publicRequest(endpoint, payload){
  console.log(payload)
  try{
    var res = fetch( `${SERVER_URL}/${endpoint}`, {
      method: 'post',
      headers: {
        'Accept':           'application/json',
        'Content-Type':     'application/json',
        'X-T3-Api-Version': 2,
        'X-T3-App-Version': AppInfo.getInfoShortVersion(),
        'X-T3-App-OS':      Platform.OS
      },
      body: JSON.stringify(payload)
    })
    return await res
  }
  catch(err){
    console.log('ERR',err)
  }
}

async function authenticatedRequest(endpoint: '', payload: {}){
  const credentials = CredentialsStore.getState()
  const authPayload = {...payload, ...credentials}

  try{
    var req = await publicRequest(endpoint, authPayload);
    return await req.json()
  }
  catch(err){
    console.log('ERR',err)
    return err
  }
}

async function authenticatedFileUpload(endpoint, image, image_type){

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
    data: { ...credentials, image_type }
  })

  try{
      return await imgUpload
    }
    catch(err){
      console.log('ERR',err)
      return err
    }
}

class api {

  login(phone,password){
    return publicRequest('login', {
      phone: phone,
      password1: password,
    })
  }

  register(phone,password1,password2){
    return publicRequest('register', {
      phone, password1, password2,
    })
  }

  async requestPin(phone){
    return await publicRequest('request_security_pin', { phone })
  }

  async verifyPin(pin,phone){

    const platform = require('Platform');

    const deviceInfo = require('./DeviceInfo')

    var payload = { pin, phone, ...deviceInfo }

    console.log('verify pin with payload',payload)

    return await publicRequest('verify_security_pin', payload);
  }

  updateUser(payload){
    return authenticatedRequest('update', payload)
  }

  getUserInfo(){
    return authenticatedRequest('info')
  }

  getMatches(page){
    return authenticatedRequest('getMatches', {page})
    //v2 endpoint
  }

  getFavorites(page){
    return authenticatedRequest('getFavourites', {page})
    //v2 endpoint
  }

  toggleFavorite(match_id){
    return authenticatedRequest('toggleMatch', {match_id})
    //v2 endpoint
  }

  unMatch(match_id){
    return authenticatedRequest('unmatch', {match_id})
  }

  reportUser(to_user_id, to_user_type, reason){

    return authenticatedRequest('report_user', { to_user_id, to_user_type, reason })
  }

  getMessages(payload){
    if(!payload.match_id){
      return false;
    }
    payload.message_type = 'retrieve';
    return authenticatedRequest('messages', payload)
  }

  createMessage(message, matchID){
    var payload = {
      'message_type':'create',
      'match_id': matchID,
      'message_body': message,
    };
    return authenticatedRequest('messages', payload)
  }

  getPotentials(coordinates){
    return authenticatedRequest('potentials',coordinates)
  }

  sendLike(like_user_id,like_status,like_user_type,from_user_type){
  // fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type, from_user_type })
  }
  // uploadImage(image,image_type){
  //   return authenticatedFileUpload('upload', image,image_type)
  // }

  saveFacebookPicture(photo) {
    console.log('save_facebook_picture', photo);
    return publicRequest('save_facebook_picture', photo);
  }
  //
  async uploadImage(image, image_type){
    console.log('UPLOAD',image, image_type)
    if(!image_type){
      console.log('NO image_type!!');
       image_type = 'profile'
    }
    return await authenticatedFileUpload('upload', image, image_type).then((response) => response.json())
  }

  joinCouple(partner_phone){
    return authenticatedRequest('join_couple', { partner_phone })
  }

  async getProfileSettingsOptions(){
    return await publicRequest('get_client_user_profile_options').then((response) => response.json())
  }

  async sendContactsToBlock(data,start){
    return await authenticatedRequest('process_phone_contacts', {data})
  }
}
module.exports = new api()
