import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';


class ChatStore {

  constructor() {

    this.state = { }

    this.exportPublicMethods({
      getMessagesForMatch: this.getMessagesForMatch

    });

    this.bindListeners({
      handleReceiveMessages: MatchActions.GET_MESSAGES

    });
    this.on('init',()=>{
      console.log('ChatStore store init')

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


  handleReceiveMessages(matchMessages) {
    this.setState(() => {
      return {
        [matchMessages.match_id]: matchMessages.message_thread,
        ...this.state[matchMessages.match_id]
      }
    }) //love that
  }



  // public methods

  getMessagesForMatch(matchID) {
    return this.getState()[matchID] || [];
  }

}

export default alt.createStore(ChatStore, 'ChatStore')
