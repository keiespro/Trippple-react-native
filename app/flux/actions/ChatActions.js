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


}

module.exports = alt.createActions(ChatActions);
