import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';


class ChatStore {

  constructor() {

    this.bindListeners({
      handleSentMessage: MatchActions.SEND_MESSAGE,
      handleReceiveMessages: MatchActions.GET_MESSAGES
    });

    this.exportPublicMethods({
      getMessagesForMatch: this.getMessagesForMatch
    });
    this.state = {
      messages: {}
    }
    this.on('init', () => console.log('ChatStore store init'))
  }

  loadLocalData(){
    AsyncStorage.getItem('ChatStore')
    .then((value) => {
      console.log('got ChatStore from storage,', JSON.parse(value))
      if (value !== null){
        // get data from local storage
        alt.bootstrap(value);
      }
    })

  }
  handleSentMessage(matchMessages) {
    console.log(matchMessages)
    this.setState(() => {
      return {
        [matchMessages.match_id]: matchMessages.message_thread,
        ...this.state[matchMessages.match_id]
      }
    })
  }
  handleReceiveMessages(matchMessages) {
    console.log(matchMessages)
    this.setState(() => {
      return {
        [matchMessages.match_id]: matchMessages.message_thread,
        ...this.state[matchMessages.match_id]
      }
    })
  }



  // public methods

  getMessagesForMatch(matchID) {
    return this.getState()[matchID] || [];
  }

}

export default alt.createStore(ChatStore, 'ChatStore')
