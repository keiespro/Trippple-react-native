import {Share} from 'react-native'
import Promise from 'bluebird'
import FCM from 'react-native-fcm'
import RNHotline from '../../lib/RNHotline/'
import api from '../utils/api'

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = () => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});

export const setHotlineUser = user => dispatch => dispatch({ type: 'SET_HOTLINE_USER',
  payload: {
    promise: new Promise((resolve, reject) => {
      const {id, firstname, phone, relationship_status, email, gender, image_url, thumb_url, partner_id} = user;
      RNHotline.setUser(`${id}`, firstname, phone, email, {relationship_status, gender, image_url, thumb_url, partner_id: `${partner_id}`});
      resolve();
    })
  }
})

export const share = payload => dispatch => dispatch({ type: 'SHARE_COUPLE_PIN',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;

      Share.share({
        title: 'Join my couple!',
        message: messageText,
        url: `trippple://joincouple/${pin}`,
      }, {
        dialogTitle: 'Send your couple pin'
      })
      .then(resolve)
      .catch(reject)
    })
  }
});

export const receivePushToken = ({push_token, loggedIn}) => dispatch => dispatch({ type: 'RECEIVE_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(loggedIn) dispatch({type: 'UPDATE_USER_PUSH_TOKEN', payload: api.updatePushToken({push_token})});
      resolve(push_token)
    })
  }
})


export const getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      FCM.getFCMToken().then(push_token => {
        dispatch(receivePushToken(push_token))
        dispatch({type: 'SAVE_PUSH_TOKEN', payload: push_token})
      })
     .catch(x => console.log(x))
    })
  }
})
