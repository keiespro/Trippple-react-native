import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';

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
  'getPotentials'
];

const endpointMap = apiActions.map(call => {
  let action = call.replace(/([A-Z])/g, function($1){return ("_"+$1).toLowerCase()}).toUpperCase();
  return { action, call }
})

const ApiActionCreators = endpointMap.reduce((obj,endpoint) => {
  obj[endpoint.call] = (...params) => (dispatch => dispatch({
    type: endpoint.action,
    meta: {
      ...params.map(p => p)
    },
    payload: {
      promise: new Promise((resolve, reject) => {
        api[endpoint.call](...params).then(x => resolve(x)).catch(x => {
          console.log(x); reject(x)
        })
      }).catch(error => {
        console.log('API ERROR',error)
        throw new Error({error:error})
        return false
      })
    }
  }))
  return obj

}, {})

export default ApiActionCreators
