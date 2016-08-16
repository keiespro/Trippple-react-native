

export default function deviceReducer(state = initialState, action) {

  switch (action.type) {
  
    case 'LOG_OUT':

      return initialState;

    default:

      return state;
  }
}


const initialState = {

};
