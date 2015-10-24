import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';
import _ from 'underscore'

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

  handleSentMessage(payload) {
    var matchMessages = payload.messages
    console.log(matchMessages)
    this.setState(() => {
      var newState = {};
      newState[`${matchMessages.match_id}`] = matchMessages.message_thread;
      return {...newState}
    })
  }

  handleReceiveMessages(payload) {
    console.log(payload,'PAYLOAD')
    if(!payload){return false}
    var matchMessages = payload.messages,
        {message_thread,match_id} = matchMessages;

    if(!message_thread.length || (message_thread.length == 1 && !message_thread[0].message_body)) return false
    console.log(this.state.messages[match_id])
    var existingMessages = this.state.messages[match_id] || []
    this.setState(() => {
      var newState = {};
      newState[`${match_id}`] = _.unique([ ...existingMessages, ...message_thread, ], 'id')

      return {...newState}

    })
  }



  // public methods

  getMessagesForMatch(matchID) {
    return this.getState()[matchID] || [];
  }
  // getUnreadCounts(){
  //
  //   return this.getState()
  // }
}

export default alt.createStore(ChatStore, 'ChatStore')
