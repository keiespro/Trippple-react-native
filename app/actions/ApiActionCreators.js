import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import _ from 'underscore'
import LogOut from '../utils/logout'

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
  'onboard',
];

const endpointMap = apiActions.map(call => {
  let action = call.replace(/([A-Z])/g, function($1){return ("_"+$1).toLowerCase()}).toUpperCase();
  return { action, call }
})

const ApiActionCreators = endpointMap.reduce((obj,endpoint) => {


  obj[endpoint.call] = (...params) => (dispatch => dispatch({

    type: endpoint.action,
    meta: endpoint.call == 'sendLike' ? {...(_.object(['like_user_id', 'like_status','like_user_type','from_user_type',],params)),
      relevantUser:  (params[params.length-1]['relevantUser'])
    } : params.map(p => p),
    payload: {
      promise: new Promise((resolve, reject) => {
        console.log();
        if(endpoint.call == 'onboard'){
          dispatch({type:'KILL_MODAL',payload:true})
        }

        api[endpoint.call](...params).then(x => {
          console.log(x);
          return resolve(x);
        }).catch(x => {
          console.log(x);
          if(x == '401'){
            // dispatch({type:'LOG_OUT',payload:true})
            LogOut()

          }
          reject(x)
        })
      })
    }
  }))
  return obj

}, {})

export default ApiActionCreators
