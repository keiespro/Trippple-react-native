import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';


export const logOut = createAction('LOG_OUT');

export const showInModal = route => dispatch({ type: 'SHOW_IN_MODAL',
  payload: { route }
}).then(logIt);

export const killModal = x => dispatch({ type: 'KILL_MODAL' }).then(logIt);


///// ASYNC ACTIONS ////////

export const getUserInfo = c => dispatch => dispatch({ type: 'FETCH_USER_INFO',
  payload: {
    promise: new Promise((resolve, reject) => {
      api.getUserInfo().then(x => resolve(x)).catch(x => reject(x))
    })
  }
}).then(logIt);

export const fetchPotentials = c => dispatch => dispatch({ type: 'FETCH_POTENTIALS',
  payload: {
    promise: new Promise((resolve, reject) => {
      api.getPotentials().then(x => resolve(x)).catch(x => reject(x))
    })
  }
}).then(logIt);


export default {getUserInfo,logOut}



const logIt = ({ value, action }) => {
  console.log(action.type, value, action);
};


// export const receiveUserInfo = createAction('FETCH_USER_INFO', async (cr) => {
//   const ui = await api.getUserInfo(cr)
//   return Promise.resolve(ui)
  // return Promise.resolve(api.getUserInfo(cr).then(x => {
  //   console.log(x);
  //   return x
  // }))
  // return Promise.resolve(api.getUserInfo(cr))
  // console.log(res);
  // return res
// });
