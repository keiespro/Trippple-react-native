import _ from 'underscore'
export default function userReducer(state = initialState, action) {
    let {user_info, existed } = (action && action.payload ? action.payload || action.payload : {});

    switch (action.type) {

    case 'TOGGLE_SHOW_BROWSE_TOOLTIP':
      return {...state, showBrowseTooltip: false}
    case 'HANDLE_NOTIFICATION_DECOUPLE':
        return {...state, partner: null, couple: null, relationship_status:'single'}

    // case 'GET_USER_INFO_PENDING':
    //
    //     return state;

    // case 'GET_USER_INFO_REJECTED':
    //
    //     return { ...state, err: action.payload };

    case 'UPDATE_USER_PENDING':
        let updates = _.values(action.meta)
        return { ...state, ...updates[0]};
    case 'GET_USER_INFO_FULFILLED':
    case 'VERIFY_PIN_FULFILLED':
        return user_info && user_info.id ? {...state, ...user_info, isNewUser: false } : state

    case 'ONBOARD_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
        return {...user_info, }

    case 'LOGIN_WITH_FACEBOOK_FULFILLED':
    case 'ONBOARD_USER_NOW_WHAT_FULFILLED':
        return user_info && user_info.id ? {...state, ...user_info, isNewUser: !existed } : state

    case 'LOG_OUT_FULFILLED':

        return initialState;

    case 'SHOW_PROFILE_FULFILLED':
        return { ...state, profile_visible: true };

    case 'HIDE_PROFILE_FULFILLED':
        return { ...state, profile_visible: false };


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

  showBrowseTooltip: true
};
