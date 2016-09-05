
export default function LikeReducer(state = initialState, action) {

  switch (action.type) {

      case 'SEND_LIKE_FULFILLED':

        let likeCount = state.likeCount || 0;

        if(action.payload.like_status == 'approve' || action.meta.like_status == 'approve'){
          likeCount = likeCount+1;
        }
        return {
          ...state,
          likeCount,
          lastLiked:0,
          relevantUser: action.payload.relevantUser || action.meta.relevantUser
        }

      default:

        return state;
  }
}


const initialState = {
  likeCount: 0
};
