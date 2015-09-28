import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage } from 'react-native'
import _ from 'underscore'

class FavoritesStore {

  constructor() {

    this.state = {
      matches: []
    }

    this.exportPublicMethods({
      getAllFavorites: this.getAllFavorites,
      getMatchInfo: this.getMatchInfo
    });

    this.bindListeners({
      handleGetFavorites: MatchActions.GET_MATCHES,
      removeMatch: MatchActions.REMOVE_MATCH,
      handleGetFavorites: MatchActions.TOGGLE_FAVORITE
    });

    this.on('init',()=>{
      console.log('matches store init')
    })
    this.on('bootstrap', () => {
      console.log('store bootstrap');

    });
  }
  loadLocalData(){

      AsyncStorage.getItem('FavoritesStore')
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
  handleInitializeFavorites(){

    // console.log(savedFavorites,'handlegetmatches');
    this.setState({
      matches: this.state.matches
    });
        // get data from server

  }


  removeMatch(matchID){
    const cleanFavorites = _.reject(this.state.matches, match => match.id === matchID);

      this.setState({
        matches: cleanFavorites
      });

  }

  handleGetFavorites(matches) {
   var matches = matchesData.matches
    if(matches.length){
      if(matchesData.page){

        this.setState({
          matches: [...this.state.matches, ...matches]
        });

      }else{
        if(!this.state.matches.length){
           this.setState({
              matches: matches
            });
        }else{

          var allmatches = this.state.matches;
          var removed = allmatches.slice(0,19)
          allmatches.unshift(matches)
          this.setState({
            matches: allmatches
          });
        }
     }

   }else{
      this.setState({
        matches: this.state.matches
      });
    }

  }

  // public methods

  getAllFavorites(){
    console.log('getmatches',this.getState().matches);
    return this.getState().matches
   }

  getMatchInfo(matchID){
    const matches = this.getState().matches
    console.log('get match info',matchID);
    var m = _.filter(matches,(ma,i) => { return ma.match_id == matchID })
    console.log('get match info',m);

    return m[0]

  }

}

 function orderFavorites(matches){
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

export default alt.createStore(FavoritesStore, 'FavoritesStore')

