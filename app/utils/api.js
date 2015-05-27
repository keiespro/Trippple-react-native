'use strict';
var Keychain = require('Keychain');

const server = 'http://api2.trippple.co';





const SERVER_URL = 'http://192.168.1.146:9920/user';

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
  .catch((err) => {
    console.log('error',err);
    // this.dispatch();
  })

};

function authenticatedRequest(endpoint: '', payload: {}){
  var payload = payload || {};
  console.log(payload,'payload')



  return Keychain.getInternetCredentials(server)
    .then(function(credentials) {
      console.log('Credentials successfully loaded', credentials);
      payload.user_id = credentials['username'];
      payload.api_key = credentials['password'];

      return publicRequest(endpoint, payload);

    });


};

var api = {

  login(phone,password){
    return publicRequest('login', {
      phone: phone,
      password1: password,
    })
  },

  register(phone,password1,password2){
    return publicRequest('register', {
      phone, password1, password2,
    })
  },

  requestPin(){
    return authenticatedRequest('request_security_pin')
  },

  verifyPin(pin,phone){
    return authenticatedRequest('verify_security_pin', { pin, phone } )
  },

  updateUser(payload){
    return authenticatedRequest('update', payload)
  },

  getUserInfo(){
    return authenticatedRequest('info')
  },

  getMatches(){
    console.log('getmatches req')
    return authenticatedRequest('matches')
  },

  getMessages(payload){
    if(!payload.match_id) return false;
    payload.message_type = 'retrieve';
    return authenticatedRequest('messages', payload)
  },

  createMessage(message, matchID){
    var payload = {
      'message_type':'create',
      'match_id': matchID,
      'message': message,
    };
    return authenticatedRequest('messages', payload)
  },

  getPotentials(coordinates){
    return authenticatedRequest('potentials',coordinates)
  },

  sendLike(like_user_id,like_status){
    var like_user_type = 'couple';// fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type })
  },






}
module.exports = api;
