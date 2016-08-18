import api from '../utils/api'

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
  let action = call.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase()}).toUpperCase();
  return { action, call }
})

const ActionMan = endpointMap.reduce((obj,endpoint) => {
  obj[endpoint.call] = c => (dispatch => dispatch({
    type: endpoint.action,
    payload: {
      promise: new Promise((resolve, reject) => {
        api[endpoint.call]().then(x => resolve(x)).catch(x => reject(x))
      })
    }
  }))
  return obj
}, {
  ...fbActions
})
