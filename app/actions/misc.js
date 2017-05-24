import {Share, NativeModules, Platform} from 'react-native'
import Promise from 'bluebird'
import FCM from 'react-native-fcm'
import RNHotline from 'react-native-hotline'
import api from '../utils/api'
import {fetchPotentials as fetchPotentialsAlgolia} from '../utils/algolia'
const iOS = Platform.OS == 'ios';

export const fetchPotentials = () => (dispatch, getState) => dispatch({

  type: 'FETCH_POTENTIALS',
  payload: {
    promise: new Promise((resolve, reject) => {
      const user = getState().user;
      const genders = user.relationship_status != 'single' ? ['looking_for_m', 'looking_for_f'] : ['looking_for_mf', 'looking_for_ff', 'looking_for_mm'];
      const gender = genders.reduce((acc, el) => {
        if(user[el]){
          acc += el.replace('looking_for_', '')
        }
        return acc
      }, '')
      const prefs = {
        relationshipStatus: user.relationship_status == 'single' ? 'couple' : 'single',
        gender: gender.length > 1 ? null : gender,
        minAge: user.match_age_min,
        maxAge: user.match_age_max,
        distanceMiles: user.match_distance || 25,
        coords: {lat: user.latitude, lng: user.longitude}
      }
      const likes = [...getState().likes.likedUsers, ...Object.keys(getState().swipeQueue)];

      const page = getState().ui.potentialsPageNumber || 0;
      return fetchPotentialsAlgolia(prefs, likes, page).then(resolve)

    })
  }
})

export const getPotentials = fetchPotentials;

export const selectCoupleGenders = (payload) => (dispatch, getState) => dispatch({ type: 'SELECT_COUPLE_GENDERS',
  payload,
})

export const fetchBrowse = ({filter, page, coords}) => (dispatch, getState) => dispatch({ type: 'FETCH_BROWSE',
  payload: api.browse({filter: filter.toLowerCase(), page, coords}),
  meta: {filter, page}
})

export const SwipeCard = params => (dispatch, getState) => dispatch({ type: 'SWIPE_CARD',
  payload: new Promise((resolve, reject) => {
    const state = getState()

    if(state.likes.likeCount > 0 && state.permissions.notifications == 'undetermined'){
      dispatch(showInModal({
        component: 'NotificationsPermissions',
        passProps: {

        }
      }))
    }
    resolve(params)
  }),
});

export const ActionModal = match => dispatch => dispatch({ type: 'SHOW_ACTION_MODAL', payload: { match } });

export const showInModal = route => dispatch => dispatch({ type: 'SHOW_IN_MODAL', payload: { route } });

export const killModal = () => dispatch => dispatch({ type: 'KILL_MODAL', payload: { } });

export const pushChat = match_id => dispatch => dispatch({ type: 'PUSH_CHAT', payload: { match_id } });

export const popChat = match_id => dispatch => dispatch({ type: 'POP_CHAT'});

export const setHotlineUser = user => dispatch => dispatch({ type: 'SET_HOTLINE_USER',
  payload: {
    promise: new Promise((resolve, reject) => {
      __DEV__ && console.log('SET HOTLINE USER', user);

      if(!iOS) RNHotline.init('f54bba2a-84fa-43c8-afa9-098f3c1aefae', 'fba1b915-fa8b-4c24-bdda-8bac99fcf92a', false);
        // .then(result => {

          // RCT_EXPORT_METHOD(setUser:(NSString *)user_id name:(NSString *)name phone:(NSString *)phone relStatus:(NSString *)relStatus gender:(NSString *)gender image:(NSString *)image thumb:(NSString *)thumb partner_id:(NSString *)partner_id ){


      const {id, firstname, email, gender, relationship_status, image_url, thumb_url, partner_id} = user;

      const meta = {
        relationship_status,
        gender,
      }

      if(partner_id){
        meta.partner_id = `${partner_id}`
      }

      RNHotline.setUser(`${id}`, firstname, email, relationship_status, gender, image_url, thumb_url, `${partner_id}`);// gender, '', thumb_url, partner_id)
      resolve(true)

        // });
    })
  }
})

export const showFaqs = () => dispatch => dispatch({ type: 'SHOW_FAQS',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(iOS){
        // RNHotline.showFaqs()
        NativeModules.RNHotlineController.showFaqs()
        resolve(true)
      }else{
        RNHotline.showFaqs('DisplayFAQsAsGrid')
        resolve(true)

      }
    })
  }
})


export const showConvos = () => dispatch => dispatch({ type: 'SHOW_CONVOS',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(iOS){
        RNHotline.showConvos()
        resolve(true)
      }else{
        RNHotline.showConvos()
        resolve(true)

      }
      // .then(resolve).catch(reject)
    })
  }
})

export const togglePotentialsPage = payload => dispatch => dispatch({ type: 'TOGGLE_POTENTIALS_PAGE', payload })

export const share = payload => dispatch => dispatch({ type: 'SHARE_COUPLE_PIN',
  payload: {
    promise: new Promise((resolve, reject) => {
      const { pin, messageText } = payload;

      Share.share({
        title: 'Join my couple!',
        message: `${messageText}`,
        url: `trippple://joincouple/${pin}`,
      }, {
        dialogTitle: 'Send your couple pin'
      })
      .then(ok => resolve(ok))
      .catch(err => reject(err))
    })
  }
});

export const receivePushToken = ({push_token, loggedIn}) => (dispatch, getState) => dispatch({ type: 'RECEIVE_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      if(getState().auth.api_key){
        dispatch({type: 'UPDATE_USER_PUSH_TOKEN', payload: api.updatePushToken({push_token})});
      }
      resolve(push_token)
    })
  }
})


export const getPushToken = () => dispatch => dispatch({ type: 'GET_PUSH_TOKEN',
  payload: {
    promise: new Promise((resolve, reject) => {
      FCM.getFCMToken().then(push_token => {
        dispatch(receivePushToken({push_token}))
        dispatch({type: 'SAVE_PUSH_TOKEN', payload: push_token})
      })
     .catch(err => {
       __DEV__ && console.log(err)
     })
    })
  }
})
