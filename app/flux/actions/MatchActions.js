import alt from '../alt';
import Api from '../../utils/api';


class MatchActions {


  removeMatch(matchID){

    this.dispatch(matchID)
  }
  getMatches(page){

    Api.getMatches(page || 0)
      .then((res) => {
        this.dispatch({matches: res.response.length ? res.response : [], page: page || false});
      })

  }

  getFavorites(page){

    // Api.getMatches(page)
    //   .then((res) => {
    //     this.dispatch({matches: res.response, page: page || false});
    //   })
    //   .catch((err) => ){ /*noop*/}
    //

  }

  getMessages(matchID,page){
    if(!matchID) {
      this.dispatch({messages: []});
      return false
    }

    Api.getMessages({match_id: matchID, page: page || false})
    .then((res) => {
      console.log(res)
        this.dispatch({messages: res.response || []});
     })
  }

  getPotentials(){

    Api.getPotentials(  )
      .then((res) => {
        this.dispatch(res.response);
      })
      .catch(err => {
        this.dispatch({status:false,matches:[]});

      })


  }

  setAccessTime(payload){
    this.dispatch(payload)
  }

  sendMessage(message, matchID,timestamp){
    this.dispatch({message, matchID,timestamp});


  }
  sendMessageToServer(message, matchID){
    Api.createMessage(message, matchID)
    .then(()=>{
      return Api.getMessages({match_id: matchID}).then((res) => {
        const messages = res.response
        Api.getMatches(0)
          .then((res) => {
            this.dispatch({messages, matchesData: {matches: res.response, page: 0}});

          })

      })
    })
    .catch((err) => {/*noop*/})


  }

  toggleFavorite(matchID){

      Api.toggleFavorite(matchID)
      .then(()=>{

         Api.getFavorites(0)
        .then((res) => {
          this.dispatch({matches: res.response, page: 0});

        })
      })


    }


  unMatch(matchID){
    Api.unMatch(matchID)
    .then(()=>{
      this.dispatch(matchID);
    })
  }

  reportUser(user, reason){
    Api.reportUser(user.id, user.relationship_status, reason)
    this.dispatch({ user_id: user.id, reason});
  }

  sendLike(likedUserID,likeStatus,likeUserType,rel_status){
    Api.sendLike(likedUserID, likeStatus,likeUserType,rel_status)

    this.dispatch({likedUserID,likeStatus});

      // .then((likeRes) => {

      //   navigator.geolocation.getCurrentPosition(
      //     (geo) => {
      //       var {latitude,longitude} = geo.coords;
      //
      //       // Api.getPotentials( {latitude,longitude} )
      //       //   .then((res) => {
      //       //     this.dispatch(res.response);
      //       //   })
      //       //
      //     },
      //     (error) => {
      //       // Open native settings
      //
      //     },
      //     {enableHighAccuracy: false, maximumAge: 1000}
      //   )
      // })

  }
}

export default alt.createActions(MatchActions);
