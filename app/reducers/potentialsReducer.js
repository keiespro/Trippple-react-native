import _ from 'lodash'
import starters from '../data/StarterDecks'

export default function potentialsReducer(state = initialState, action) {

  switch (action.type) {
    case 'ONBOARD_FULFILLED':
    case 'VERIFY_COUPLE_PIN_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
    case 'HANDLE_NOTIFICATION_DECOUPLE':
    case 'CLEAR_POTENTIALS':
      return initialState;

    case 'REMOVE_POTENTIAL':
      const targetID = action.payload.id;
      const newPotentials = [...state].reject(m => m.user.id == targetID || m.partner.id == targetID || m.couple.id == targetID);
      return [...newPotentials]

    case 'GET_STARTER_POTENTIALS':
      const starter = starters[action.payload.relationshipStatus || 'single'];
      return [...(_.shuffle(starter))];

    case 'GET_POTENTIALS_FULFILLED':
      const data = action.payload;
      let pots;
      if(!data || !data.matches || !data.matches.length){
        pots = state
      }else if(!data.matches[0] || !data.matches[0].user){
        pots = data.matches.map(pot => ({user: pot}));
      }else{
        pots = data.matches
      }
      if(pots[0] && (pots[0].user.id == global.creds.user_id || pots[0].partner.id == global.creds.user_id)){
        return [...(pots.slice(1, pots.length))];
      }

      return [...pots];

    // case 'SEND_LIKE_FULFILLED':
    case 'SWIPE_CARD_FULFILLED':
      return [...(state.slice(1, state.length))];

    default:

      return state;
  }
}


const initialState = []
