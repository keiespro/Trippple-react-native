import alt from '../alt';
import Api from '../../utils/api';
import { AlertIOS } from 'react-native'

class MatchActions {

  removeMatch(matchID){
    return matchID
  }

  getMatches(page) {
    return (dispatch) => {
      Api.getMatches(page || 0)
        .then((res) => {
          dispatch({matches: res.response.length ? res.response : [], page: page || false});
        })
    };
  }

  getFavorites(page){
    return true
  }

  getMessages(matchID, page) {
    return (dispatch) => {
      if(!matchID) {
        dispatch({messages: []})
      }
      Api.getMessages({match_id: matchID, page: page || false})
      .then((res) => {
        dispatch({messages: res.response || []});
      })
    };
  }

  getPotentials() {
    return (dispatch) => {
      Api.getPotentials(  )
      .then((res) => {
        dispatch(res.response);
      })
      .catch((err) => {
        dispatch(err);
      })
    };
  }

  setAccessTime(payload){
    return payload;
  }

  sendMessage(message, matchID,timestamp){
    return {message, matchID,timestamp};
  }

  sendMessageToServer(message, matchID) {
    return (dispatch) => {
      Api.createMessage(message, matchID)
      .then(()=>{
        return Api.getMessages({match_id: matchID}).then((res) => {
          const messages = res.response;
          Api.getMatches(0)
          .then((resMatches) => {
            dispatch({messages, matchesData: {matches: resMatches.response, page: 0}})
          })
        })
      })
      .catch((err) => {
        console.warn('Message failed to send',err)
      })
    };
  }

  toggleFavorite(matchID) {
    return (dispatch) => {
      Api.toggleFavorite(matchID)
      .then(()=>{
        Api.getFavorites(0)
        .then((res) => {
          dispatch({matches: res.response, page: 0});
        })
      })
    };
  }

  unMatch(matchID) {
    return (dispatch) => {
      Api.unMatch(matchID)
      .then(()=>{
        dispatch(matchID);
      })
    };
  }

  reportUser(user, reason) {
    return (dispatch) => {
      Api.reportUser(user.id, (user.relationship_status ? 'single' : 'couple'), reason)
      .then((res)=> {
        if(res.status == 200){
          AlertIOS.alert('User reported.')
          dispatch({ user_id: user.id, reason, user})
        }else{
          AlertIOS.alert('Unable to report user','Please try again later.')
          dispatch({})

        }
      })
    };
  }

  sendLike(likedUserID, likeStatus, likeUserType, rel_status) {
    return (dispatch) => {
      Api.sendLike(likedUserID, likeStatus,likeUserType,rel_status)

      dispatch({likedUserID,likeStatus});
    };
  }

}

export default alt.createActions(MatchActions);
