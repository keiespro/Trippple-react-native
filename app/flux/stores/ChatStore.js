import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';
import {matchWasAdded, messageWasAdded} from '../../utils/matchstix'
import _ from 'underscore'
import Log from '../../Log'

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
    this.on('init', () => {/*noop*/})
    this.on('error', (err, payload, currentState) => {
      Log(err, payload, currentState);
    })
    this.on('afterEach', (state) =>{
      this.save()
    })


  }

  save(){

    var partialSnapshot = alt.takeSnapshot(this);
    AsyncStorage.setItem('ChatStore',JSON.stringify(partialSnapshot));


  }

  handleSentMessage(payload) {
    var matchMessages = payload.messages
    this.setState(() => {
      var newState = {};
      newState[`${matchMessages.match_id}`] = matchMessages.message_thread;
      return {...newState}
    })
  }

  handleReceiveMessages(payload) {

    if(!payload){return false}
    var matchMessages = payload.messages,
        {message_thread,match_id} = matchMessages;

    if(!message_thread.length || (message_thread.length == 1 && !message_thread[0].message_body)) return false
    message_thread.map(messageWasAdded);
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

}

export default alt.createStore(ChatStore, 'ChatStore')
