'use strict';

var serverUrl = 'http://192.168.1.146:9920/user';

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

function authenticatedRequest(endpoint, payload){
  var payload = payload || {};
  payload.user_id = 450;
  payload.api_key = 'beb9bac01c65e5aac1ddb0aafede274e32ada79b';

  return fetch( `${serverUrl}/${endpoint}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((res) => res.json())

};

var api = {

  login(phone,password){
    return publicRequest('login', {
      phone: phone,
      password1: password,
    })
  },

  getMatches(){
    console.log('getmatches req')
    return authenticatedRequest('matches')
  },

  getPotentials(){
    return authenticatedRequest('potentials')
  },

  getMessages(params){
    console.log('get msgs match id',params.match_id);
    if(!params.match_id) return false;
    params.message_type = 'retrieve';
    return authenticatedRequest('messages', params)
  },

  getUserInfo(){
    return authenticatedRequest('info')
  }


}
module.exports = api;
