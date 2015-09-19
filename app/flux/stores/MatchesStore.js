import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage } from 'react-native'
import _ from 'underscore'

class MatchesStore {

  constructor() {

    this.state = {
      matches: []
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches
    });

    this.bindListeners({
      handleGetMatches: MatchActions.GET_MATCHES,
      removeMatch: MatchActions.REMOVE_MATCH
    });

    this.on('init',()=>{
      console.log('matches store init')
    })
    this.on('bootstrap', () => {
      console.log('store bootstrap');

    });
  }
  loadLocalData(){

      AsyncStorage.getItem('MatchesStore')
        .then((value) => {
          console.log('got matches from storage,', JSON.parse(value))
          if (value !== null){
            // get data from local storage
            alt.bootstrap(value);
          }
        })
        .catch((err) => {
          console.log(err);
        })
  }
  handleInitializeMatches(){

    // console.log(savedMatches,'handlegetmatches');
    this.setState({
      matches: this.orderMatches(this.state.matches)
    });
        // get data from server

  }


  removeMatch(matchID){
    const cleanMatches = _.reject(this.state.matches, match => match.id === matchID);

      this.setState({
        matches: cleanMatches
      });

  }

  handleGetMatches(matches) {
    console.log(matches,'handlegetmatches');
    if(matches.length){
      const combinedMatches = this.state.matches.concat(matches.matches ? matches.matches : matches);
      this.setState({
        matches: combinedMatches
      });
    }else{
      this.setState({
        matches: this.orderMatches(this.state.matches)
      });
    }

  }

  orderMatches(matches){
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
  // public methods

  getAllMatches(){
    console.log('getmatches',this.getState().matches);
    var m = this.getState().matches
    return orderMatches(m)
   }



}

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
