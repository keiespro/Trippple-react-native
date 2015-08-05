var alt = require('../alt');
var Api = require("../../utils/api");
var Logger = require("../../utils/logger");

class MatchActions {

  getMatches(){

    Api.getMatches()
      .then((res) => {
        Logger.log(res)
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
      (error) => {
        // Open native settings

        Logger.error(error)
      },
      {enableHighAccuracy: false, maximumAge: 1000}
    )
  }

  sendLike(likedUserID,likeStatus){
    this.dispatch(likedUserID);

    Api.sendLike(likedUserID, likeStatus)
      .then((res) => {
        Logger.log(res)
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
          (error) => {
            // Open native settings

            Logger.error(error)
          },
          {enableHighAccuracy: false, maximumAge: 1000}
        )
      })
  }
}

module.exports = alt.createActions(MatchActions);
