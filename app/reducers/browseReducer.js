export default function browseReducer(state = initialState, action) {

  let stateUser;

  switch (action.type) {
    case 'ONBOARD_FULFILLED':
    case 'VERIFY_COUPLE_PIN_FULFILLED':
    case 'HANDLE_NOTIFICATION_COUPLE_READY':
    case 'HANDLE_NOTIFICATION_DECOUPLE':
    case 'CLEAR_POTENTIALS':
      return initialState;

    case 'SEND_LIKE_FULFILLED':
      stateUser = state[action.meta.likeUserId] ? state[action.meta.likeUserId].user : {id: action.meta.likeUserId};

      return {
        ...state,
        [action.meta.likeUserId]: {
          ...state[action.meta.likeUserId],
          user: {
            ...stateUser,
            liked: action.meta.likeStatus == 'approve',
          },
          likedAt: Date.now()
        }
      } // note to self: next time use immutable.js

    case 'FETCH_BROWSE_FULFILLED':
      return action.payload ? {
        ...state,
        ...Object.values(action.payload).reduce((acc, u) => {
          if(u && u.user){
            acc[u.user.id] = u;
          }
          return acc
        }, {})
      } : state;

    default:
      return state;
  }
}


const initialState = {}
