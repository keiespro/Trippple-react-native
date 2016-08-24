import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import _ from 'underscore'

const apiActions = [
  'requestPin',
  'verifyPin',
  'fbLogin',
  'updateUser',
  'getMatches',
  'getNewMatches',
  'unMatch',
  'reportUser',
  'getNotificationCount',
  'getMessages',
  'createMessage',
  'sendLike',
  'decouple',
  'getCouplePin',
  'verifyCouplePin',
  'updatePushToken',
  'disableAccount',
  'getUserInfo',
  'getPotentials',
  'uploadFacebookPic',
  'onboard'
];

const endpointMap = apiActions.map(call => {
  let action = call.replace(/([A-Z])/g, function($1){return ("_"+$1).toLowerCase()}).toUpperCase();
  return { action, call }
})

const ApiActionCreators = endpointMap.reduce((obj,endpoint) => {


  obj[endpoint.call] = (...params) => (dispatch => dispatch({

    type: endpoint.action,
    meta: endpoint.call == 'sendLike' ? {...(_.object(['like_user_id', 'like_status','like_user_type','from_user_type',],params)),
      relevantUser:  (params.filter(p => typeof p == 'object')[0]['relevantUser'])
    } : params.map(p => p),
    payload: {
      promise: new Promise((resolve, reject) => {

        if(endpoint.call == 'onboard'){
          dispatch({type:'KILL_MODAL',payload:true})
        }
        if(endpoint.call == 'sendLike'){
          const relevantUser = params.filter(p => typeof p == 'object');
        }

        api[endpoint.call](...params).then(x => resolve(x)).catch(x => {
          console.log(x); reject(x)
        })
      })
    }
  }))
  return obj

}, {})

export default ApiActionCreators
