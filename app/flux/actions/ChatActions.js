var alt = require('../alt');
var Api = require("../../utils/api");

class ChatActions {
  getMatches() {
    Api.getMatches()
      .then((res) => {
        console.log(res)
        this.dispatch(res.response);
      })
  }


}

module.exports = alt.createActions(ChatActions);
