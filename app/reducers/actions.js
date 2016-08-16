import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';


// export function connectFacebook (fbUser) {
//   return {
//     type: 'connect_facebook',
//     payload: {
//       fbUser,
//     }
//   };
// }
//
// export function receiveUserInfo (userInfo) {
//   return {
//     type: 'receive_user_info',
//     payload: {
//       userInfo,
//     }
//   };
// }
//
// export function logOut () {
//   return {
//     type: 'log_out',
//     payload: {}
//   };
// }
//
import loadSavedCredentials from '../../Credentials'

export const connectFacebook = createAction('connect_facebook');
export const logOut = createAction('log_out');

export const receiveUserInfo = createAction('RECEIVE_USER_INFO', async (cr) => {
  // const cr = await loadSavedCredentials();
  const ui = await api.getUserInfo(cr)
  return Promise.resolve(ui)
  // return Promise.resolve(api.getUserInfo(cr).then(x => {
  //   console.log(x);
  //   return x
  // }))
  // return Promise.resolve(api.getUserInfo(cr))
  // console.log(res);
  // return res
});


export default {receiveUserInfo,connectFacebook,logOut}
