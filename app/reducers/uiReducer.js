
export default function uiReducer(state = initialState, action) {

  switch (action.type) {
    case 'OPEN_PROFILE':
      return {...state, profileVisible: true };
    case 'CLOSE_PROFILE':
      return {...state, profileVisible: false };

    case 'KILL_MODAL':

      return {...state, activeModal: null, actionModal: null, lastModal: state.activeModal };

    case 'SHOW_IN_MODAL':

      return {...state, activeModal: action.payload.route };

    case 'SHOW_ACTION_MODAL':

      return {...state, actionModal: action.payload.match };

    case 'POP_CHAT':
    case 'CHAT_IS_CLOSED':

      return {...state, chat: null}

    case 'PUSH_CHAT':
    case 'CHAT_IS_OPEN':

      return {...state, chat: {open: true, match_id: action.payload.match_id}}

    case 'OPEN_DRAWER':

      return {...state, drawerOpen: true}

    case 'SET_DRAWER_OPEN':
      return {...state, drawerOpen: true}

    case 'SET_DRAWER_CLOSED':
      return {...state, drawerOpen: false}

    case 'EX_NAVIGATION.SET_CURRENT_NAVIGATOR':
      return {...state, currentIndex: action.index };

    // case 'EX_NAVIGATION.BATCH':
    case 'EX_NAVIGATION.PUSH':
      return {...state, currentIndex: state.currentIndex + 1 };
    case 'EX_NAVIGATION.POP':
      return {...state, currentIndex: state.currentIndex - 1 };

    case 'GET_USER_INFO_REJECTED':
    case 'GET_USER_INFO_FULFILLED':
      return {...state, loadedUser: true };

    case 'LOGIN_WITH_FACEBOOK_PENDING':
    case 'LOADING_PENDING':

      return {
        ...state,
        loggingIn: true
      }


    case 'ONBOARD_FULFILLED':
    case 'LOADING_FULFILLED':
    case 'LOGIN_WITH_FACEBOOK_FULFILLED':

      return {
        ...state,
        loggingIn: false
      }


    default:

      return state;
  }
}


const initialState = {
  chat: null,
  activeModal: null,
  profileVisible: false,
  drawerOpen: false,
  currentIndex: 0,
  loggingIn: false
};
