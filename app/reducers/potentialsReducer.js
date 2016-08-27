
export default function potentialsReducer(state = initialState, action) {

  switch (action.type) {

    case 'REMOVE_POTENTIAL':
      let targetID = actions.payload.id;
      const newPotentials = [...state].reject(m => m.user.id == targetID || m.partner.id == targetID || m.couple.id == targetID)
      return [...newPotentials]

    case 'GET_POTENTIALS_FULFILLED':
      const data = action.payload.response;
      let pots;
      if(!data || !data.matches || !data.matches.length){
        return state
      }
      if(!data.matches[0].user){
        pots = data.matches.map((pot,i)=>{
          return {user: pot}
        })
      }else{
        pots = data.matches
      }

      return [ ...pots]

    case 'SEND_LIKE_FULFILLED':
      console.log(action.payload);
      const potes = state.slice(1,state.length)


      return [...potes]

    default:

      return state;
  }
}


const initialState = []
