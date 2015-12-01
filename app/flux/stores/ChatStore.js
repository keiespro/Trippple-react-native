import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';
import {matchWasAdded, messageWasAdded} from '../../utils/matchstix'
import _ from 'underscore'
import Log from '../../Log'
import UserStore from './UserStore'

class ChatStore {

  constructor() {

    this.bindListeners({
      handleSentMessage: MatchActions.SEND_MESSAGE_TO_SERVER,
      handleLocalMessage: MatchActions.SEND_MESSAGE,
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
      if(__DEV__){
        console.log(err, payload, currentState);
      }
    })
    this.on('bootstrap', (p) => {
      if(__DEV__){
        console.log('bootstrap',p);
      }
    })


    this.on('afterEach', ({payload,state}) =>{
      if(__DEV__){
        console.log('aftereach',state,payload)
      }
      if(payload.payload && payload.payload.messages && payload.payload.messages.match_id){
        this.save()
      }
    })


  }

  save(){

    var partialSnapshot = alt.takeSnapshot(ChatStore);
    if(__DEV__){
      console.log('partialSnapshot',partialSnapshot)
    }
    AsyncStorage.setItem('ChatStore',JSON.stringify(partialSnapshot.ChatStore));


  }
  handleLocalMessage(payload){
    const {message, matchID,timestamp} = payload
    const user = UserStore.getUser()

    const newMessage = {
      created_timestamp: timestamp,
      message_body: message,
      from_user_info: {
        name: user.firstname,
        id: user.id,
        match_id: matchID
      },
      ephemeral: true,
      matchId: matchID,
      id: timestamp
  }
  console.log(...this.state[matchID])
    const oldMessages = this.state[matchID] || []
    const newStateMessages = [...[newMessage], ...oldMessages]

    this.setState({[matchID]: newStateMessages});


  }

  handleSentMessage(payload) {
    var matchMessages = payload.messages
    this.setState(() => {
      var newState = {};
      newState[`${matchMessages.match_id}`] = matchMessages.message_thread;
      return {...newState}
    })
    this.emitChange()

  }

  handleReceiveMessages(payload) {

    if(!payload || !payload.messages){return false}

    var {message_thread,match_id} = payload.messages;

    if(!message_thread || !message_thread.length || (message_thread.length == 1 && !message_thread[0].message_body)) return false

    message_thread.map((m)=>{m.matchId = match_id; return m}).map(messageWasAdded);
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
