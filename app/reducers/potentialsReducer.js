
export default function potentialsReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_POTENTIALS_FULFILLED':
      const data = action.payload.response;
      let pots;
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
