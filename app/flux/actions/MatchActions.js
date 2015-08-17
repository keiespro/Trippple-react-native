import alt from '../alt';
import Api from "../../utils/api";


class MatchActions {

  getMatches(){

    Api.getMatches()
      .then((res) => {
        console.log(res)
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
        var coordinates = {
          latitude: geo.coords.latitude,
          longitude: geo.coords.longitude
        };
        Api.getPotentials(coordinates)
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

  sendLike(likedUserID,likeStatus){
    console.log(likedUserID)
    this.dispatch(likedUserID);

    Api.sendLike(likedUserID, likeStatus)
      .then((res) => {
        console.log(res)
        navigator.geolocation.getCurrentPosition(
          (geo) => {
            console.log('Got coordinates:', geo.coords);
            var coordinates = {
              latitude: geo.coords.latitude,
              longitude: geo.coords.longitude
            };
            Api.getPotentials(coordinates)
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
