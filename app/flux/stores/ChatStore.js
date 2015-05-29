var alt = require('../alt');
var MatchActions = require('../actions/MatchActions');
var AsyncStorage = require('react-native').AsyncStorage;


class ChatStore {

  constructor() {

    this.state = { }

    this.exportPublicMethods({
      getMessagesForMatch: this.getMessagesForMatch

    });

    this.bindListeners({
      handleGetMessages: MatchActions.GET_MESSAGES

    });
    this.on('init',()=>{
      console.log('store init')

      AsyncStorage.getItem('ChatStore')
        .then((value) => {
          console.log('got ChatStore from storage,', JSON.parse(value))
          if (value !== null){
            // get data from local storage
            alt.bootstrap(value);
          }

        })
    })
  }


  handleGetMessages(matchMessages) {
    this.setState(() => {
      var newState = {};
      newState[matchMessages.match_id] = matchMessages.message_thread.reverse();
      return newState;
    });
  }



  // public methods

  getMessagesForMatch(matchID){

    return this.getState()[matchID] || [];
  }


}

module.exports = alt.createStore(ChatStore, 'ChatStore');
