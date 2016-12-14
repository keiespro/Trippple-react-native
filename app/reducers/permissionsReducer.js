import {Platform} from 'react-native'

export default function permissionsReducer(state = initialState, action) {
  switch (action.type) {

    case 'CHECK_LOCATION_PERMISSION_FULFILLED':
      return {...state, location: action.payload }
    case 'CHECK_NOTIFICATIONS_PERMISSION_FULFILLED':
      return {...state, notifications: action.payload }
    case 'CHECK_CONTACTS_PERMISSION_FULFILLED':
      return {...state, contacts: action.payload || true }


    default:

      return state;
  }
}


const initialState = {
  location: null,
  notifications: Platform.select({android: true,ios:false}),
  contacts: null,

};
