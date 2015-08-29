
import Promise from 'bluebird'
import { FileTransfer } from 'NativeModules'

const CredentialsStore = require('../flux/stores/CredentialsStore')
const UploadFile = Promise.promisify(FileTransfer.upload)


const SERVER_URL = 'http://x.local:9999/user'

function publicRequest(endpoint, payload){

  return fetch( `${SERVER_URL}/${endpoint}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then((res) => res.json())

}

function authenticatedRequest(endpoint: '', payload: {}){

  const credentials = CredentialsStore.getState();
  const authPayload = {...payload, ...credentials}

  return publicRequest(endpoint, authPayload);
}

function authenticatedFileUpload(endpoint, image, image_type){
  const credentials = CredentialsStore.getState();

  const url = `${SERVER_URL}/${endpoint}`

  return UploadFile({
    uri: image,
    uploadUrl: url,
    fileName: 'file.jpg',
    mimeType:'jpeg',
    data: { ...credentials, image_type }
  })
  .then( (res, err) => {
    console.log('res:',res,'err:',err);
    return res.response;
  })
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

  requestPin(phone){
    return publicRequest('request_security_pin', { phone })
  }

  verifyPin(pin,phone){

    // // TEMPORARY
    // var uuid = 'xxxxxxxxx',
    //     model = 'test',
    //     platform = 'iOS',
    //     version = '8',
    //     push_token = null;

    const platform = require('Platform');
    console.log(platform);

    const deviceInfo = require('./DeviceInfo')

    var payload = {
      pin,
      phone,
      ...deviceInfo
    };

    return publicRequest('verify_security_pin', payload);
  }

  updateUser(payload){
    return authenticatedRequest('update', payload)
  }

  getUserInfo(){
    return authenticatedRequest('info')
  }

  getMatches(){
    return authenticatedRequest('matches')
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

  sendLike(like_user_id,like_status){
    var like_user_type = 'couple';// fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type })
  }

  uploadImage(image, imagetype){
    return authenticatedFileUpload('upload', image, imagetype)
  }


}
module.exports = new api()
