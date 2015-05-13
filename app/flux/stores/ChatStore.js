var alt = require('../alt');
var ChatActions = require('../actions/ChatActions');

class ChatStore {

  constructor() {

    this.state = {
    }

    this.exportPublicMethods({
      getMessagesForMatch: this.getMessagesForMatch

    });

    this.bindListeners({
      handleGetMessages: ChatActions.GET_MESSAGES

    });
  }

  handleGetMessages(matchMessages) {
    console.log(matchMessages,'handlegetmessages');
    this.setState(() => {
      var newState = {};
      newState[matchMessages.match_id] = matchMessages.message_thread;
      return newState;
    })
  }


  // public methods

  getMessagesForMatch(matchID){
    console.log('getMessagesForMatch',matchID,this.getState());
    return this.getState()[matchID] || [];
  }


}

module.exports = alt.createStore(ChatStore, 'ChatStore');
