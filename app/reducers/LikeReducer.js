
export default function LikeReducer(state = initialState, action) {
  switch (action.type) {

    case 'SWIPE_CARD_FULFILLED':

      let likeCount = Math.max(state.likeCount, 0);
      const actionSource = action.payload || {};
      if(actionSource.likeStatus == 'approve'){
        likeCount += 1;
      }
      return {
        ...state,
        likeCount,
        lastLiked: 0,
        relevantUser: actionSource.relevantUser || null
      }
    case 'SEND_LIKE_FULFILLED':

      return {
        ...state,
        fullCount: state.fullCount + 1
      }
    default:

      return state;
  }
}


const initialState = {
  likeCount: 0,
  fullCount: 0
};
