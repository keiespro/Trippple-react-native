import alt from '../alt';
import Api from '../../utils/api';


class MatchActions {


  removeMatch(matchID){

    this.dispatch(matchID)
  }
  getMatches(page){

    Api.getMatches(page || 0)
      .then((res) => {
        this.dispatch({matches: res.response, page: page || false});
      })

  }

  getFavorites(page){

    Api.getMatches(page || 0)
      .then((res) => {
        console.log('RES FAVS',res)
        this.dispatch({matches: res.response, page: page || 0});
      })
      .catch(err => console.log(err))


  }

  getMessages(matchID,page){

    if(!matchID) {
      this.dispatch({messages: []});
      return false
    }

    Api.getMessages({match_id: matchID, page: page || false})
      .then((res) => {
        this.dispatch({messages: res.response});
      })
  }

  getPotentials(){

    navigator.geolocation.getCurrentPosition(
      (geo) => {
        console.log('Got coordinates:', geo.coords);
        var {latitude,longitude} = geo.coords;

        Api.getPotentials( {latitude,longitude} )
          .then((res) => {
            this.dispatch(res.response);
          })
          .catch(err => {
            console.log('GEO ERROR POTENTIALS:',err)
          })

      },
      (error) => {
        // Open native settings

        console.log('GEO ERROR POTENTIALS:',error)
        this.dispatch(error);

      },
      {enableHighAccuracy: false, maximumAge: 1000}
    )
  }

  setAccessTime(payload){
    this.dispatch(payload)
  }

  sendMessage(message, matchID){

    Api.createMessage(message, matchID)
    .then(()=>{

      return Api.getMessages({match_id: matchID})
      .then((res) => {
        var messages = res.response
        Api.getMatches(0)
          .then((res) => {
            console.log(res)
            this.dispatch({messages, matchesData: {matches: res.response, page: 0}});

          })

      })
    })
    .catch(err => {console.log('promise err',err)})


  }


  toggleFavorite(matchID){

      Api.toggleFavorite(matchID)
      .then(()=>{

        return Api.getFavorites(0)
        .then((res) => {
          console.log(res)
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
    console.log('REPORT USER:',user,reason)
    Api.reportUser(user.id, user.relationship_status, reason)
    this.dispatch({ user_id: user.id, reason});
  }

  sendLike(likedUserID,likeStatus,likeUserType,rel_status){
    console.log(likedUserID)
    Api.sendLike(likedUserID, likeStatus,likeUserType,rel_status)

    this.dispatch(likedUserID);

      // .then((likeRes) => {

      //   navigator.geolocation.getCurrentPosition(
      //     (geo) => {
      //       var {latitude,longitude} = geo.coords;
      //
      //       // Api.getPotentials( {latitude,longitude} )
      //       //   .then((res) => {
      //       //     this.dispatch(res.response);
      //       //   })
      //       //   .catch(err => console.log(err))
      //       //
      //     },
      //     (error) => {
      //       // Open native settings
      //
      //       console.error(error)
      //     },
      //     {enableHighAccuracy: false, maximumAge: 1000}
      //   )
      // })

  }
}

export default alt.createActions(MatchActions);
