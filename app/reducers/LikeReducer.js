
export default function LikeReducer(state = initialState, action) {
console.log(action);
    switch (action.type) {

    case 'SWIPE_CARD_FULFILLED':

        let likeCount = Math.max(state.likeCount,0);
        let actionSource = action.payload || {};
        if(actionSource.likeStatus == 'approve'){
            likeCount = likeCount+1;
        }
        return {
            ...state,
            likeCount,
            lastLiked:0,
            relevantUser: actionSource.relevantUser || null
        }

    default:

        return state;
    }
}


const initialState = {
    likeCount: 0
};
