import alt from '../alt';
import Api from '../../utils/api';


class MatchActions {


  removeMatch(matchID){

    this.dispatch(matchID)
  }
  getMatches(page){

    Api.getMatches(page)
      .then((res) => {
        this.dispatch(res.response);
      })
      .catch(err => console.log(err))

  }

  getMessages(matchID,page){

    Api.getMessages({match_id: matchID, page: page})
    .then((res) => {
      console.log(res)
        this.dispatch(res.response);
      })
      .catch(err => console.log(err))

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
          .catch(err => console.log(err))

      },
      (error) => {
        // Open native settings

        console.error(error)
      },
      {enableHighAccuracy: false, maximumAge: 1000}
    )
  }

  sendMessage(message, matchID){

    Api.createMessage(message, matchID)
    .then(()=>{
      Api.getMessages({match_id: matchID})
      .then((res) => {
        this.dispatch(res.response);
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

  }


  sendLike(likedUserID,likeStatus){
    console.log(likedUserID)

    this.dispatch(likedUserID);

    Api.sendLike(likedUserID, likeStatus)
      .then((likeRes) => {

        navigator.geolocation.getCurrentPosition(
          (geo) => {
            var {latitude,longitude} = geo.coords;

            Api.getPotentials( {latitude,longitude} )
              .then((res) => {
                this.dispatch(res.response);
              })
          },
          (error) => {
            // Open native settings

            console.error(error)
          },
          {enableHighAccuracy: false, maximumAge: 1000}
        )
      })
      .catch(err => console.log(err))

  }
}

export default alt.createActions(MatchActions);
