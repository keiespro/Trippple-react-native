'use strict';

var serverUrl = 'http://192.168.2.4:9920/user';

function publicRequest(endpoint, payload){

  return fetch( `${serverUrl}/${endpoint}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((res) => res.json())

};

function authenticatedRequest(endpoint: '', payload: {}){
  var payload = payload || {};
  console.log(payload,'payload')
  payload.user_id = 450;
  payload.api_key = 'beb9bac01c65e5aac1ddb0aafede274e32ada79b';

  return publicRequest(endpoint, payload);

};

var api = {

  login(phone,password){
    return publicRequest('login', {
      phone: phone,
      password1: password,
    })
  },

  register(phone,password){
    return publicRequest('register', {
      phone: phone,
      password1: password,
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

  getPotentials(){
    return authenticatedRequest('potentials')
  },

  sendLike(like_user_id,like_status){
    var like_user_type = 'couple';// fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type })
  },






}
module.exports = api;
