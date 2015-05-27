var alt = require('../alt');
var Api = require("../../utils/api");

class ChatActions {

  initializeMatches() {
    this.dispatch();
  }

  getMatches() {

    Api.getMatches()
      .then((res) => {
        console.log(res)
        this.dispatch(res.response);
      })
  }
  getMessages(matchID) {

    Api.getMessages({match_id: matchID})
      .then((res) => {
        this.dispatch(res.response);
      })
  }

  getPotentials() {
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        console.log(geo);
        var coordinates = {
          lat: geo.coords.latitude,
          lon: geo.coords.longitude
        };
        Api.getPotentials(coordinates)
          .then((res) => {
            this.dispatch(res.response);
          })
      },
      (error) => console.error(error),
      {enableHighAccuracy: false, maximumAge: 1000}
    )

  }

  sendLike(likedUserID){

    this.dispatch(likedUserID);

  }
}

module.exports = alt.createActions(ChatActions);
