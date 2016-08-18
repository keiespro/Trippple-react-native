import alt from '../alt';
import Api from '../../utils/api';
import { Alert } from 'react-native'
import fakePotentials from '../../potentialsStub'
import Analytics from '../../utils/Analytics'
import StarterDecks from '../../StarterDecks'
import SettingsConstants from '../../utils/SettingsConstants'
import {Settings} from 'react-native'
const {HAS_SEEN_STARTER_DECK} = SettingsConstants


class MatchActions {

  removeMatch(matchID){

    Analytics.extra('Social',{
      type: 'negative',
      name:'Remove Match',
      target: matchID
    })
    Analytics.increment('RemovedMatches',1)

    return matchID
  }
  //
  // removePotential(p){
  //   if(p){
  //     Analytics.extra('Social',{
  //       type: 'negative',
  //       name:'Remove Potential',
  //       target: p.id
  //     })
  //     Analytics.increment('RemovedPotentials',1)
  //   }
  //   // else just cleanup
  //   return p || true
  //
  // }
  //
  // getMatches(page) {
  //   return (dispatch) => {
  //     Api.getMatches(page || 0)
  //       .then((res) => {
  //         dispatch({matches: res.response.length ? res.response : [], page: page || false});
  //         this.getNewMatches.defer()
  //
  //       })
  //       .catch((err) => {
  //         dispatch({error: err})
  //         this.getNewMatches.defer()
  //
  //       })
  //   };
  //
  // }
  // getNewMatches() {
  //   return (dispatch) => {
  //     Api.getNewMatches()
  //       .then((res) => {
  //         //console.log('newMatches ', res.response);
  //         dispatch({matches: res.response.length ? res.response : []});
  //       })
  //       .catch((err) => {
  //         dispatch({error: err})
  //       })
  //   };
  // }
  //
  // getFavorites(page){
  //   return true
  // }
  //
  // getMessages(matchID, page) {
  //
  //
  //   return (dispatch) => {
  //     if(!matchID) {
  //       // dispatch({messages: []})
  //     }
  //     Api.getMessages({match_id: matchID, page: page || false})
  //     .then((res) => {
  //       dispatch({messages: res.response || []});
  //     })
  //     .catch((err) => {
  //       dispatch({error: err})
  //     })
  //   };
  // }
  //
  // resetUnreadCount(match_id){
  //   return match_id
  // }
  //
  // getPotentials(relationship_status) {
  //   return (dispatch) => {
  //     if(!Settings.get(HAS_SEEN_STARTER_DECK)){
  //       __DEV__ && console.log('Using Starter Deck');
  //       dispatch({matches: StarterDecks[relationship_status],is_starter:true})
  //       Settings.set({[HAS_SEEN_STARTER_DECK]:true})
  //     }else{
  //       Api.getPotentials(  )
  //       .then((res) => {
  //
  //         dispatch(res.response);
  //       })
  //       .catch((err) => {
  //         dispatch(err);
  //       })
  //     }
  //   };
  // }
  //
  //
  // getFakePotentials() {
  //   return (dispatch) => {
  //       dispatch(fakePotentials);
  //   };
  // }
  //
  // // getStarterDeck(relationship_status) {
  // //   return (dispatch) => {
  // //       dispatch();
  // //   };
  // // }
  //
  //
  //
  // setAccessTime(payload){
  //   return payload;
  // }
  //
  // sendMessage(message, matchID,timestamp){
  //   Analytics.extra('Social',{
  //     type:'positive',
  //     name: 'Send message',
  //     message,
  //
  //   })
  //
  //   Analytics.increment('messages_sent',1)
  //
  //   return {message, matchID,timestamp};
  // }
  //
  // sendMessageToServer(message, matchID) {
  //   return (dispatch) => {
  //     Api.createMessage(message, matchID)
  //     .then(()=>{
  //       return Api.getMessages({match_id: matchID})
  //               .then((res) => {
  //                 const messages = res.response;
  //                 Api.getMatches(0)
  //                 .then((resMatches) => {
  //                   dispatch({messages, matchesData: {matches: resMatches.response, page: 0}})
  //                 })
  //                 .catch((err) => {
  //                   dispatch({error: err})
  //                 })
  //               })
  //               .catch((err) => {
  //                 dispatch({error: err})
  //               })
  //     })
  //     .catch((err) => {
  //       console.warn('Message failed to send',err)
  //     })
  //   };
  // }
  //
  // toggleFavorite(matchID) {
  //   return (dispatch) => {
  //     Api.toggleFavorite(matchID)
  //     .then(()=>{
  //       Api.getFavorites(0)
  //       .then((res) => {
  //         dispatch({matches: res.response, page: 0});
  //       })
  //       .catch((err) => {
  //         dispatch({error: err})
  //       })
  //     })
  //     .catch((err) => {
  //       dispatch({error: err})
  //     })
  //   };
  // }
  //
  // unMatch(matchID) {
  //   return (dispatch) => {
  //     Api.unMatch(matchID)
  //     .then(()=>{
  //       Analytics.extra('Social',{
  //         type: 'negative',
  //         name:'Remove Match',
  //         target: matchID
  //       })
  //       Analytics.increment('RemovedMatches',1)
  //
  //       dispatch(matchID);
  //     })
  //     .catch((err) => {
  //       dispatch({error: err})
  //     })
  //   };
  // }
  //
  // reportUser(user, reason) {
  //   return (dispatch) => {
  //     Api.reportUser(user.id, (user.relationship_status ? 'single' : 'couple'), reason)
  //     .then((res)=> {
  //
  //       Analytics.extra('Social',{
  //         type: 'negative',
  //         name: 'Report User',
  //         target: user.id,
  //         reason
  //       })
  //       Analytics.increment('ReportedUsers',1)
  //
  //       if(res.status == 200){
  //         Alert.alert('User reported.')
  //         dispatch({ user_id: user.id, reason, user})
  //       }else{
  //         Alert.alert('Unable to report user','Please try again later.')
  //         dispatch({})
  //
  //       }
  //     })
  //     .catch((err) => {
  //       dispatch({error: err})
  //     })
  //   };
  // }
  //
  // sendLike(likedUserID, likeStatus, likeUserType, rel_status) {
  //   return (dispatch) => {
  //
  //             Analytics.extra('Social',{
  //               type: likeStatus == 'approve' ? 'positive' : 'negative',
  //               name: (likeStatus == 'approve' ? 'Like' : 'Dislike'),
  //               target: likedUserID
  //             })
  //             Analytics.increment('Swipes',1)
  //             Analytics.increment(likeStatus == 'approve' ? 'Likes' : 'Dislikes',1)
  //
  //     return Api.sendLike(likedUserID, likeStatus,likeUserType,rel_status)
  //     .then((res)=>{
  //       this.removePotential.defer();
  //
  //       dispatch({likedUserID,likeStatus});
  //     })
  //     .catch((err)=>{
  //       this.removePotential.defer();
  //       dispatch(err)
  //     })
  //   };
  // }

}

export default MatchActions
