import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';
import {matchWasAdded, messageWasAdded} from '../../utils/matchstix'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'
import UserStore from './UserStore'
import AppActions from '../actions/AppActions'


class ChatStore {

  constructor() {

    this.bindListeners({
      handleSentMessage: MatchActions.SEND_MESSAGE_TO_SERVER,
      handleLocalMessage: MatchActions.SEND_MESSAGE,
      handleSaveStores: AppActions.SAVE_STORES,
      handleReceiveMessages: MatchActions.GET_MESSAGES,
      handleResetUnreadCount: MatchActions.RESET_UNREAD_COUNT
    });

    this.exportPublicMethods({
      getUnreadForMatch: this.getUnreadForMatch,
      getMessagesForMatch: this.getMessagesForMatch
    });

    this.state = {
      unread: {}
    }

    this.on('init', () => {
      // Analytics.all('INIT ChatStore');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR ChatStore',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP ChatStore',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      if(x.payload.action == 'MatchActions.getMessages' || x.payload.action == 'MatchActions.resetUnreadCount'){

          if((x.payload.data.messages && x.payload.data.messages.match_id && !x.state[x.payload.data.messages.match_id]) || x.payload && x.payload.data && x.payload.data.messages && x.payload.data.messages.message_thread && x.payload.data.messages.message_thread.length && x.payload.data.messages.message_thread.length >= x.state[x.payload.data.messages.match_id].length ){
            console.log('saving chat store',x);
            this.save()
          }

      }
    });

  }
  handleSaveStores(){
    this.save();
  }

  save(){
    var partialSnapshot = alt.takeSnapshot(this);
    Analytics.log('partialSnapshot',partialSnapshot)
    AsyncStorage.setItem('ChatStore',JSON.stringify(partialSnapshot));


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
    // Analytics.log(Object.keys(payload))
    if(!payload || !payload.messages){return false}

    const {message_thread, match_id} = payload.messages;

    if(!message_thread || !message_thread.length || (message_thread.length == 1 && !message_thread[0].message_body)) return false


    const existingMessages = this.state[match_id] || [];

    const updatedMessageThread = message_thread.map((m)=>{m.matchId = match_id; return m});

    if(!existingMessages.length){

      this.setState({ [match_id]: updatedMessageThread })

    }else{
      // if(existingMessages.length == updatedMessageThread.length){
      //   return
      // }
      const currentLastMessage = existingMessages[0];
      if(currentLastMessage.id == updatedMessageThread[0]['id']){
        return;
      }

      const newIndexForLastMessage = _.findIndex(updatedMessageThread, (msg => msg.id == currentLastMessage.id ))
      const newMessages = _.first(updatedMessageThread, newIndexForLastMessage);
      const newMessagesCount = newMessages.length;

      const currentUnread = this.state.unread[match_id];
      this.setState({
        unread: { ...this.state.unread, [match_id]: currentUnread + newMessagesCount },
        [match_id]: [ ...newMessages, ...existingMessages ]
      })
    }


  }


  handleResetUnreadCount(match_id){
    this.setState({
      unread: { ...this.state.unread, [match_id]: 0 },
    })
  }
  // public methods

  getMessagesForMatch(matchID) {
    return this.getState()[matchID] || [];
  }
  getUnreadForMatch(matchID) {
    return this.getState()['unread'][matchID] || 0;
  }

}

export default alt.createStore(ChatStore, 'ChatStore')
