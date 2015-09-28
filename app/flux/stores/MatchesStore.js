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
      getAllMatches: this.getAllMatches,
      getMatchInfo: this.getMatchInfo
    });

    this.bindListeners({
      handleGetMatches: MatchActions.GET_MATCHES,
      removeMatch: MatchActions.REMOVE_MATCH,
      toggleFavorite: MatchActions.TOGGLE_FAVORITE,
      sendMessage: MatchActions.SEND_MESSAGE
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


  removeMatch(matchID){
    const cleanMatches = _.reject(this.state.matches, match => match.id === matchID);

      this.setState({
        matches: cleanMatches
      });

  }

  sendMessage(payload){
    var matchesData = payload.matchesData;
    this.getNewMatches(matchesData)
  }
  toggleFavorite(matchesData) {
    this.getNewMatches(matchesData)
  }
  getNewMatches(matchesData){
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
          console.log(removed.length,allmatches.length)

          allmatches.unshift(...matches)
          console.log(allmatches);
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

  handleGetMatches(matchesData) {
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

  getAllMatches(){
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
