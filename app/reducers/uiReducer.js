
export default function uiReducer(state = initialState, action) {

  switch (action.type) {

    case 'KILL_MODAL':

       return {...state, activeModal: null, lastModal: state.activeModal };

    case 'SHOW_IN_MODAL':

       return {...state, activeModal: action.payload.route };

    default:

      return state;
  }
}


const initialState = {

  activeModal: null

};
