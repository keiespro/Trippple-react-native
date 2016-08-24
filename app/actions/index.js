import api from '../utils/api'
import { createAction, handleAction, handleActions } from 'redux-actions';
import * as fbActions from './facebook'
import * as appActions from './appActions'
import apiActions from './ApiActionCreators'

const ActionMan = {
  ...apiActions,
  ...fbActions,
  ...appActions
}


ActionMan.ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

ActionMan.showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

ActionMan.killModal = () => dispatch => dispatch({ type: 'KILL_MODAL' });

ActionMan.getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN' });

ActionMan.checkLocation = l => dispatch => dispatch({ type: 'CHECK_LOCATION',
  payload: {
    promise: new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        geo => resolve(geo),
        error => reject(error),
        {
          enableHighAccuracy: false,
          maximumAge: 1
        }
      );
    })
  }
});






export default ActionMan


// export const receiveUserInfo = createAction('GET_USER_INFO', async (cr) => {
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
