
export default function LikeReducer(state = initialState, action) {

  switch (action.type) {
    case 'SEND_LIKE_PENDING':
      console.log(action);

      return {...state, likeCount, lastLiked:0 }

    case 'SEND_LIKE_FULFILLED':
      console.log(action.meta.relevantUser);
      const likeCount = action.payload.like_status == 'approve' ? (state.likeCount + 1) : state.likeCount
      return {...state, likeCount, lastLiked:0, relevantUser: action.meta.relevantUser }

    default:

      return state;
  }
}


const initialState = {
  likeCount: 0
};
