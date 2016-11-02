import _ from 'lodash'
import starters from '../data/StarterDecks'

export default function potentialsReducer(state = initialState, action) {
  let tid;
  let data;
  let pots;
  let userid;

  switch (action.type) {
    case 'ONBOARD_FULFILLED':
    case 'VERIFY_COUPLE_PIN_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
    case 'HANDLE_NOTIFICATION_DECOUPLE':
    case 'CLEAR_POTENTIALS':
      return initialState;

    case 'REMOVE_POTENTIAL':
      tid = action.payload.id;
      return [...([...state].reject(m => m.user.id == tid || m.partner.id == tid || m.couple.id == tid))]

    case 'GET_STARTER_POTENTIALS':
      return [...(_.shuffle(starters[action.payload.relationshipStatus || 'single']))];

    case 'GET_POTENTIALS_FULFILLED':
      data = action.payload;
      if(!data || !data.matches || !data.matches.length){
        pots = state
      }else if(!data.matches[0] || !data.matches[0].user){
        pots = data.matches.map(pot => ({user: pot}));
      }else{
        pots = data.matches
      }
      userid = global.creds.user_id;
      if(pots[0] && (pots[0].user.id == userid || pots[0].partner.id == userid)){
        return [...(pots.slice(1, pots.length))];
      }
      return [...pots];

    case 'SEND_LIKE_FULFILLED':
      return [...(state.slice(1, state.length))];

    default:
      return state;
  }
}


const initialState = []
