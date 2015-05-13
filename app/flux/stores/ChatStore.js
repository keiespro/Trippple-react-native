var alt = require('../alt');
var ChatActions = require('../actions/ChatActions');

class ChatStore {
  constructor() {

    this.state = {
      matches: []
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches

    });

    this.bindListeners({
      handleGetMatches: ChatActions.GET_MATCHES,

    });
  }

  handleGetMatches(matches) {
    console.log(matches,'handlegetmatches');
    this.setState({
      matches: matches
    })
  }

  getAllMatches(){
    console.log('getmatches');
    return this.getState().matches;

  }
}

module.exports = alt.createStore(ChatStore, 'ChatStore');
