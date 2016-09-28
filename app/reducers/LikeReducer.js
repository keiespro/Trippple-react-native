
export default function LikeReducer(state = initialState, action) {

    switch (action.type) {

    case 'SEND_LIKE_FULFILLED':

        let likeCount = state.likeCount || 0;
        let actionSource = action.meta || {};
        if(actionSource.like_status == 'approve'){
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
