import _ from 'lodash'
import starters from '../data/StarterDecks'

export default function potentialsReducer(state = initialState, action) {

  switch (action.type) {

      case 'REMOVE_POTENTIAL':
        let targetID = action.payload.id;
        const newPotentials = [...state].reject(m => m.user.id == targetID || m.partner.id == targetID || m.couple.id == targetID)
        return [...newPotentials]

      case 'GET_STARTER_POTENTIALS':
        let starter = starters[action.payload.relationshipStatus]
        return [...(_.shuffle(starter))]

      case 'GET_POTENTIALS_FULFILLED':
        const data = action.payload.response;
        let pots;
        if(!data || !data.matches || !data.matches.length){
          return state
        }
        if(!data.matches[0].user){
          pots = data.matches.map(pot => {
            return {user: pot}
          })
        }else{
          pots = data.matches
        }

        return [ ...pots]

      case 'SEND_LIKE_FULFILLED':
        // const potes = state.slice(1,state.length)
        return [...(state.slice(1,state.length))]

      default:

        return state;
  }
}


const initialState = []
