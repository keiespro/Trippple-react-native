
export default function userReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_USER_INFO_PENDING':

      return state;

    case 'GET_USER_INFO_REJECTED':

      return { ...state, err: action.payload };

    case 'GET_USER_INFO_FULFILLED':
    case 'VERIFY_PIN_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':
      const {user_info} = action.payload.response || action.payload
      return {...state, ...user_info}

    case 'LOG_OUT':

      return initialState;

    default:

      return state;
  }
}


const initialState = {
    // id: null,
    // active: null,
    // status: null,
    // email: null,
    // firstname: null,
    // lastname: null,
    // phone: null,
    // gender: null,
    // bday_month: null,
    // bday_year: null,
    // relationship_status: null,
    // looking_for_mm: null,
    // looking_for_ff: null,
    // looking_for_mf: null,
    // looking_for_m: null,
    // looking_for_f: null,
    // match_distance: null,
    // match_age_min: null,
    // match_age_max: null,
    // privacy: null,
    // partner_id: null,
    // facebook_user_id: null,
    // bio: null,
    // height: null,
    // body_type: null,
    // couple_id: null,
    // latitude: null,
    // longitude: null,
    // is_image_flagged: null,
    // timezone: null,
    // eye_color: null,
    // hair_color: null,
    // ethnicity: null,
    // smoke: null,
    // drink: null,
    // bust_size: null,
    // birthday: null,
    // admin_comment: null,
    // location_id: null,
    // is_active_user: null,
    // is_stub: null,
    // recycle_interval: null,
    // image_url: null,
    // thumb_url: null,

};
