import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import _ from 'lodash'
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
  'verifyPin'
];

const endpointMap = apiActions.map(call => {
  const action = call.replace(/([A-Z])/g, ($1) => { return (`_${$1}`).toLowerCase() }).toUpperCase();
  return { action, call }
})

const ApiActionCreators = endpointMap.reduce((obj, endpoint) => {
  obj[endpoint.call] = (...params) => (dispatch => dispatch({

    type: endpoint.action,
    meta: endpoint.call == 'sendLike' ? {...(_.zipObject(['like_user_id', 'like_status', 'like_user_type', 'from_user_type',], params)),
      relevantUser: (params[params.length - 1].relevantUser)
    } : params.map(p => p),
    payload: {
      promise: new Promise((resolve, reject) => {
        let shouldFetchUserInfo,
          shouldFetchPotentials;
        if(endpoint.call == 'onboard'){
          dispatch({type: 'KILL_MODAL', payload: true})
        }

        if(['uploadfacebookpic', 'decouple', 'verifycouplepin', 'updateuser','fblogin', 'onboard'].indexOf(endpoint.call.toLowerCase()) > -1){
          shouldFetchUserInfo = true
        }

        if(['decouple', 'verifycouplepin', 'onboard','updateuser','fblogin'].indexOf(endpoint.call.toLowerCase()) > -1){
          shouldFetchPotentials = true
        }

        api[endpoint.call](...params).then(x => {
          if(shouldFetchUserInfo){
            dispatch({type: 'GET_USER_INFO', payload: api.getUserInfo()})
          }
          if(shouldFetchPotentials){
            dispatch({type: 'GET_POTENTIALS', payload: api.getPotentials()})
          }


          return resolve(x);
        }).catch(x => {
          if(x === 401){
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
