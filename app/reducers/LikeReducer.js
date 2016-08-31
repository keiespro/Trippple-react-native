
export default function LikeReducer(state = initialState, action) {

  switch (action.type) {

      case 'SEND_LIKE_FULFILLED':
        console.log(action);

        let likeCount = state.likeCount || 0;

        if(action.meta.like_status == 'approve'){
          console.log('++++++++');
          likeCount = likeCount+1;
          console.log(likeCount);
        }
        return {
          ...state,
          likeCount,
          lastLiked:0,
          relevantUser: action.meta.relevantUser
        }

      default:

        return state;
  }
}


const initialState = {
  likeCount: 0
};
