import alt from '../alt';
import Api from '../../utils/api';


class MatchActions {

  getMatches(){

    Api.getMatches()
      .then((res) => {
        this.dispatch(res.response);
      })
  }

  getMessages(matchID){

    Api.getMessages({match_id: matchID})
      .then((res) => {
        this.dispatch(res.response);
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
      .then((res) => {
        this.dispatch(res.response);
      })
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
  }
}

export default alt.createActions(MatchActions);
