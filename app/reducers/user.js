// import { fromJS } from 'immutable';
import { createAction, handleAction, handleActions } from 'redux-actions';
import api from '../utils/api'

const initialState = {
  credentials: {
    api_key: null,
    user_id: null
  },
  userInfo: {
    id: null,
    active: null,
    status: null,
    email: null,
    firstname: null,
    lastname: null,
    phone: null,
    gender: null,
    bday_month: null,
    bday_year: null,
    relationship_status: null,
    looking_for_mm: null,
    looking_for_ff: null,
    looking_for_mf: null,
    looking_for_m: null,
    looking_for_f: null,
    match_distance: null,
    match_age_min: null,
    match_age_max: null,
    privacy: null,
    partner_id: null,
    facebook_user_id: null,
    bio: null,
    height: null,
    body_type: null,
    couple_id: null,
    latitude: null,
    longitude: null,
    is_image_flagged: null,
    timezone: null,
    eye_color: null,
    hair_color: null,
    ethnicity: null,
    smoke: null,
    drink: null,
    bust_size: null,
    birthday: null,
    admin_comment: null,
    location_id: null,
    is_active_user: null,
    is_stub: null,
    recycle_interval: null,
    image_url: null,
    thumb_url: null,
  },
  fbUser: {
    accessToken: null,
    permissions: ["user_location","user_birthday","user_photos","public_profile","email","user_friends","user_likes","contact_email"],
    declinedPermissions:[],
    applicationID:"367243980090932",
    userID: null,
    expirationTime:null,
    lastRefreshTime:null
  }
};

// handleActions({
//   // 'connect_facebook': (state, action) => {
//   //   console.log(action);
//   //   state.update('fbUser', (action.payload.fbUser));
//   //   return state;
//   // },
//   RECEIVE_USER_INFO(state, action){
//     const payload = action.payload;
//     console.log('RECEIVE_USER_INFO',payload);
//     const userInfo = payload.then(x => {
//       const n = x.response.user_info
//       console.log(n)
//       return n
//     }).done();
//
//     return {
//       ...state,
//       userInfo: (userInfo)
//     }
//   },
//   // receive_user_info: (state, action) => {
//   //   console.log(action,'receive_user_info');
//   //   state.update('userInfo', fromJS(action.payload.user_info));
//   //   return state;
//   // },
//
//   // 'log_out': (state, action) => {
//   //   console.log(action);
//   //   state = initialState;
//   //   return state;
//   // },
//   // '@@INIT': (state, action) => {return initialState},
//
// },initialState)
//
//


//
// // A single reducer...
//  handleAction('RECEIVE_USER_INFO', (state = initialState, action) => {
//   console.log(action);
//   return ({
//     // ...state,
//     userInfo: action.payload
//   })
// }, {userInfo:'x'} );

// export const receiveUserInfo = createAction('RECEIVE_USER_INFO', async c =>  await api.getUserInfo(c));


function user(state = initialState, action) {
  console.log(action.type,action);

  switch (action.type) {
    case 'connect_facebook':
      state.update('fbUser', (action.payload.fbUser));
      return state;
   case 'RECEIVE_USER_INFO_PENDING':
      return state;
   case 'RECEIVE_USER_INFO_REJECTED':
      return {
        err: action.payload
      };
    case 'RECEIVE_USER_INFO_FULFILLED':
      console.log(action.payload);
      state.userInfo = action.payload.response.user_info
      return state
    case 'log_out':
      state = initialState;
      return state;
    default:
      return state;
  }
}

module.exports = user;
