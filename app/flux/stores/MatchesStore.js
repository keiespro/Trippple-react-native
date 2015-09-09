import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage } from 'react-native'


class MatchesStore {

  constructor() {

    this.state = {
      matches: []
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches
    });

    this.bindListeners({
      handleGetMatches: MatchActions.GET_MATCHES
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
      matches: this.state.matches
    });
        // get data from server

  }




  handleGetMatches(matches) {
    console.log(matches,'handlegetmatches');
    if(matches.length){
      const combinedMatches = this.state.matches.concat(matches);
      this.setState({
        matches: combinedMatches
      });
    }

  }


  // public methods

  getAllMatches(){
    console.log('getmatches');

    var _threads = this.getState().matches;

    var orderedThreads = [];

    for (var id in _threads) {
      var thread = _threads[id];
      orderedThreads.push(thread);
    }
    // wrong formatting, rensmr lastMessage
    orderedThreads.sort(function(a, b) {
      if (a.lastMessage.date < b.lastMessage.date) {
        return 1;
      } else if (a.lastMessage.date > b.lastMessage.date) {
        return -1;
      }
      return 0;
    });

    return orderedThreads;

  }



}

export default alt.createStore(MatchesStore, 'MatchesStore')
