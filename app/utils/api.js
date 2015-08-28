
var Keychain = require('react-native-keychain');
var Promise = require('bluebird');
var KEYCHAIN_NAMESPACE = window.keychainUrl || global.keychainUrl || 'trippple.co'

var NativeModules = require('NativeModules');
var UploadFile = Promise.promisify(NativeModules.FileTransfer.upload);


var Logger = require('./logger');

var SERVER_URL = 'http://x.local:9999/user';

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
  var payload = payload || {};
  Logger.debug(payload,'payload');
  return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then(function(credentials) {
      console.log('Credentials successfully loaded', credentials);
      payload.user_id = credentials.username;
      payload.api_key = credentials.password;
      return publicRequest(endpoint, payload);
    });
}

function authenticatedFileUpload(endpoint, image, imagetype){
  return Keychain.getInternetCredentials(KEYCHAIN_NAMESPACE)
    .then(function(credentials) {
      console.log('Credentials successfully loaded', credentials);
      var url = `${SERVER_URL}/${endpoint}`;
      var payload = {
          uri: image,
          uploadUrl: url,
          fileName: 'file.jpg',
          mimeType:'jpeg',
          data: {
            user_id: credentials.username,
            api_key: credentials.password,
            image_type: imagetype
          }
      };
      return UploadFile(payload)
              .then( (res, err) => {
                console.log('res:',res,'err:',err);
                return res.response;
              })
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

    // TEMPORARY
    var uuid = 'xxxxxxxxx',
        model = 'test',
        platform = 'iOS',
        version = '8',
        push_token = null;

    var payload = {
      pin,
      phone,
      uuid,
      model,
      platform,
      version,
      push_token
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
