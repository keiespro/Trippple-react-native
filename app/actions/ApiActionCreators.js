import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import _ from 'lodash'
import {logOut} from './appActions'
import {showInModal} from './misc'

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
  'verifyPin',
  'hideProfile',
  'showProfile',
  'browse'
];

const endpointMap = apiActions.map(call => {
  const action = call.replace(/([A-Z])/g, ($1) => { return (`_${$1}`).toLowerCase() }).toUpperCase();
  return { action, call }
})

const ApiActionCreators = endpointMap.reduce((obj, endpoint) => {
  obj[endpoint.call] = (...params) => ((dispatch, getState) => dispatch({

    type: endpoint.action,
    meta: endpoint.call == 'sendLike' ? {
      ...params
    }[0] : params.map(p => p),
    payload: {
      promise: new Promise((resolve, reject) => {
        let shouldFetchUserInfo,
          shouldFetchPotentials,
          p;
        if(endpoint.call == 'onboard'){
          dispatch({type: 'KILL_MODAL', payload: true})
        }

        if(['uploadfacebookpic', 'decouple', 'verifycouplepin', 'updateuser','fblogin', 'onboard'].indexOf(endpoint.call.toLowerCase()) > -1){
          shouldFetchUserInfo = true
        }

        if(['sendLike','decouple', 'verifycouplepin', 'onboard','updateuser','fblogin'].indexOf(endpoint.call.toLowerCase()) > -1){
          shouldFetchPotentials = true
        }
        if(endpoint.call == 'sendLike'){
          p = Object.values(params[0])
          // console.log(p);
        }else{
          p = params
        }
        api[endpoint.call](...p).then(x => {

          if(shouldFetchUserInfo){
            dispatch({type: 'GET_USER_INFO', payload: api.getUserInfo()})
          }
          if(shouldFetchPotentials){
            const user = getState().user;
            const prefs = {
              relationshipStatus: user.relationship_status == 'single' ? 'couple' : 'single',
              gender: 'f',//TODO: fix
              minAge: user.match_age_min,
              maxAge: user.match_age_max,
              distanceInMeters: (user.match_distance || 25)*3,
              coords: {lat:user.latitude,lng:user.longitude}
            }
            dispatch({type: 'GET_POTENTIALS', payload: api.getPotentials(prefs)})
          }
          return resolve(x);
        }).catch(err => {
          __DEV__ && console.log('CAUGHT ERR',err.status);
          if(err.status == '401'){
            dispatch(logOut())
            return reject(err)
          }else if(err.status == '500' || err.status == '502' || err.status == '504'){

            dispatch(showInModal({component:'MaintenanceScreen',passProps:{}}))
            return reject(err)
          }


        })
      })
    }
  }))
  return obj
}, {})

export default ApiActionCreators
