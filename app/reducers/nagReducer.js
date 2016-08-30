
export default function nagReducer(state = initialState, action) {

  switch (action.type) {
  case 'ASKED_PARTNER':
    return {...state, askedPartner: true };
  case 'ASKED_LOCATION':
    return {...state, askedLocation: true };
  case 'ASKED_NOTIFICATIONS':
    return {...state, askedNotification: true };
  case 'ASKED_RELATIONSHIP_STATUS':
    return {...state, askedRelationshipStatus: true };

  case 'GET_USER_INFO':
    return {...state, askedRelationshipStatus: action.payload.relationship_status ? true : false }

  case 'SEND_LIKE_FULFILLED':
    return state

  case 'UNASKED_LOCATION':
    return {...state, askedLocation: false };

  default:

    return state;
  }
}


const initialState = {
  askedPartner: false,
  askedNotification: false,
  askedLocation: false,
  askedRelationshipStatus: false

};
