var alt = require('../alt');
var Api = require("../../utils/api");

class ChatActions {

  initializeMatches(savedMatches) {
    this.dispatch(savedMatches);


  }

  getMatches() {
    // this.dispatch();

    Api.getMatches()
      .then((res) => {
        console.log(res)
        this.dispatch(res.response);
      })
  }
  getMessages(matchID) {
    // this.dispatch();

    Api.getMessages({match_id: matchID})
      .then((res) => {
        console.log(res)
        this.dispatch(res.response);
      })
  }


}

module.exports = alt.createActions(ChatActions);
