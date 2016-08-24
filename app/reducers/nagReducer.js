
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


    case 'SEND_LIKE_FULFILLED':
        return state

    default:

      return state;
  }
}


const initialState = {
  askedPartner: false,
  askedNotification: false,
  askedLocation: false,

};
