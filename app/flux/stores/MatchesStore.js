import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import Log from '../../Log'
import NotificationActions from '../actions/NotificationActions'
import {matchWasAdded, messageWasAdded} from '../../utils/matchstix'
import {AsyncStorage, AlertIOS} from 'react-native'
import _ from 'underscore'

class MatchesStore {


  constructor() {
    this.state = {
      matches: [],
      favorites: [],
      unreadCounts: {},
      lastAccessed: {},
      mountedAt: new Date().getTime(),
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches,
      getAllFavorites: this.getAllFavorites,
      getMatchInfo: this.getMatchInfo,
      getAnyUnread: this.getAnyUnread
    });

    this.bindListeners({
      handleGetFavorites: MatchActions.GET_FAVORITES,
      handleGetMatches: MatchActions.GET_MATCHES,
      removeMatch: MatchActions.REMOVE_MATCH,
      toggleFavorite: MatchActions.TOGGLE_FAVORITE,
      sendMessage: MatchActions.SEND_MESSAGE_TO_SERVER,
      insertLocalMessage: MatchActions.SEND_MESSAGE,
      updateLastAccessed: MatchActions.SET_ACCESS_TIME,
      unMatch: MatchActions.UN_MATCH,
      handleNewMessages: MatchActions.GET_MESSAGES
    });

    this.on('init', () => {/*noop*/})
    this.on('error', (err, payload, currentState) => {
      if(__DEV__){
        console.log('ERROR',err, payload, currentState);
      }
    })
    this.on('bootstrap', (p) => {
      if(__DEV__){
        console.log('bootstrap',p);
      }
    })
    this.on('afterEach', ({payload, state}) =>{

      if(state.matches.length != this.state.matches.length){
        this.save()
        console.log('saving',payload,state)

      }

    })
  }
  save(){

    var partialSnapshot = alt.takeSnapshot(this);
    AsyncStorage.setItem('MatchesStore',JSON.stringify(partialSnapshot.MatchesStore));

  }
  unMatch(matchID){
    this.removeMatch(matchID)
  }

  removeMatch(matchID){
    const cleanMatches = _.reject(this.state.matches, match => match.match_id === matchID);

    this.setState({
      matches: cleanMatches
    });

  }

  updateLastAccessed(payload){
    // save timestamp of last match view, reset unread counts
    const {match_id, timestamp} = payload
    const newCounts = this.state.unreadCounts
    newCounts[match_id] = 0

    this.setState({
      lastAccessed: {...this.state.lastAccessed,  match_id: timestamp },
      unreadCounts: newCounts
    })
  }
  handleNewMessages(payload){
    if(!payload){return false}
    var { match_id, message_thread } = payload.messages;

    if(!message_thread || !message_thread.length || (message_thread.length == 1 && !message_thread[0].message_body)) return false

    var newCounts = {[match_id]: this.state.unreadCounts[match_id] || 0},
          access = this.state.lastAccessed;

// prevent tripppling of value??

    if( !newCounts[match_id] ){
      newCounts[match_id] = 0;
    }

    if( !access[match_id] ){
      access[match_id] = this.state.mountedAt
    }

    for(var msg of message_thread){
      if(msg.created_timestamp && !access[match_id] || (access[match_id] < (msg.created_timestamp * 1000))){
          newCounts[match_id]++
      }
    }

    this.setState({
      unreadCounts: { ...this.state.unreadCounts, ...newCounts}
    })

  }
  handleResetUnreadCount(match_id){
    const newCounts = {...this.state.unreadCounts}
    newCounts[match_id] = 0

    React.NativeModules.PushNotificationManager.setApplicationIconBadgeNumber(currentCount+delta)
    NotificationActions.changeAppIconBadgeNumber(newCounts[match_id].length * -1)
    result + newCounts[match_id]

    this.setState({
      unreadCounts: newCounts
    })
  }
  sendMessage(payload){
    this.handleGetMatches(payload.matchesData)
  }
  toggleFavorite(matchesData) {
    this.handleGetFavorites(matchesData)

  }
  insertLocalMessage(payload){
    // const {message, matchID} = payload
    // const cleanMatches = _.(this.state.matches, match => match.match_id === matchID);

    // this.setState({
    //   matches: cleanMatches
    // });

  }
  handleGetMatches(matchesData){
    const {matches} = matchesData

    if(matches.length > 0){
      var allmatches, allunread, allLastAccessed

      if(!this.state.matches.length){
        // first batch of matches
        allmatches = matches
        allunread = _.object( _.pluck(matches,'match_id'), matches.map(()=> 0))
        allLastAccessed = _.object( _.pluck(matches,'match_id'), matches.map(()=> this.state.mountedAt))

        // allmatches.map(matchWasAdded);
      }else{
        // paged or refresh - deduplicate results, preserve unread counts and access times
        allmatches = _.unique([
          ...this.state.matches,
          ...matches
        ],'match_id')

        allunread = {
          ..._.object( _.pluck(allmatches,'match_id'), allmatches.map(()=> 0)),
          ...this.state.unreadCounts
        }

        allLastAccessed = {
          ..._.object( _.pluck(allmatches,'match_id'), allmatches.map(()=> this.state.mountedAt)),
          ...this.state.lastAccessed
        }
      }
      this.setState({
        matches: allmatches,
        unreadCounts: allunread,
        lastAccessed: allLastAccessed,
      });

   }else{
     // refresh but no update

      this.emitChange()
    }
  }

  handleGetFavorites(matchesData) {
    const favs = matchesData.matches

    if(favs.length && this.state.matches.length){
      let matches = _.unique([ ...this.state.matches, ...favs], 'match_id'),
          favorites = _.unique([ ...this.state.favorites, ...favs], 'match_id')

      this.setState({
        matches, favorites
      })
      this.emitChange()
    }
  }

  // public methods
  getAnyUnread(){

    const unread = this.getState().unreadCounts
    return ~~_.find(unread,(c)=> c > 0)
  }

  getAllMatches(){
    const unread = this.getState().unreadCounts,
          matches = this.getState().matches || []

    return matches.map((m,i) => {
      m.unreadCount = unread[m.match_id] || 0
      return m
    })
  }

  getAllFavorites(){
    const unread = this.getState().unreadCounts,
          matches = this.getState().matches || []

    var f = matches.filter((match) => match.isFavourited).map((m,i) => {
      m.unreadCount = unread[m.match_id] || 0
      return m
    })
    return f
  }



  getMatchInfo(matchID){

    let m = _.filter(this.getState().matches, (ma,i) => { return ma.match_id == matchID || ma.id == matchID || ma.matchID == matchID })
    m[0].unreadCount = this.getState().unreadCounts[matchID] || 0
    return m[0]
  }



 }


// not used in this implementation:

 function orderMatches(matches){
   var _threads = matches;

    var orderedThreads = [];

    for (var id in _threads) {
      var thread = _threads[id];
      orderedThreads.push(thread);
    }
    // wrong formatting, rensmr lastMessage
    orderedThreads.sort(function(a, b) {
      if (a.recent_message.created_timestamp < b.recent_message.created_timestamp) {
        return 1;
      } else if (a.recent_message.created_timestamp > b.recent_message.created_timestamp) {
        return -1;
      }
      return 0;
    });

    return orderedThreads;


  }

export default alt.createStore(MatchesStore, 'MatchesStore')
