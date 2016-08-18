
export default function uiReducer(state = initialState, action) {

  switch (action.type) {
    case 'OPEN_PROFILE':
        return {...state, profileVisible: true };
   case 'CLOSE_PROFILE':
        return {...state, profileVisible: false };

    case 'KILL_MODAL':

       return {...state, activeModal: null, lastModal: state.activeModal };

    case 'SHOW_IN_MODAL':

       return {...state, activeModal: action.payload.route };

    default:

      return state;
  }
}


const initialState = {

  activeModal: null,
  profileVisible: false
};
