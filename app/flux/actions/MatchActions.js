var alt = require('../alt');
var Api = require("../../utils/api");
var Logger = require("../../utils/logger");

class MatchActions {

  initializeMatches() {
    this.dispatch();
  }

  getMatches() {

    Api.getMatches()
      .then((res) => {
        Logger.log(res)
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
        Logger.log('Got coordinates:', geo.coords);
        var coordinates = {
          latitude: geo.coords.latitude,
          longitude: geo.coords.longitude
        };
        Api.getPotentials(coordinates)
          .then((res) => {
            this.dispatch(res.response);
          })
      },
      (error) => Logger.error(error),
      {enableHighAccuracy: false, maximumAge: 1000}
    )

  }

  sendLike(likedUserID){

    Api.getMatches()
      .then((res) => {
        Logger.log(res)
        this.dispatch(likedUserID);
      })

  }
}

module.exports = alt.createActions(MatchActions);
