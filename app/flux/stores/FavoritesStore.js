// import alt from '../alt'
// import MatchActions from '../actions/MatchActions'
// import { AsyncStorage } from 'react-native'
// import _ from 'underscore'
// import Analytics from '../../utils/Analytics'
//
// class FavoritesStore {
//
//   constructor() {
//
//     this.state = {
//       matches: []
//     }
//
//     this.exportPublicMethods({
//       getAllFavorites: this.getAllFavorites,
//       getMatchInfo: this.getMatchInfo
//     });
//
//     this.bindListeners({
//     handleGetMatches: MatchActions.GET_MATCHES,
//       handleGetFavorites: MatchActions.GET_FAVORITES,
//       removeMatch: MatchActions.REMOVE_MATCH,
//       handleToggleFavorite: MatchActions.TOGGLE_FAVORITE
//     });
//
//    this.on('init', () => {/*noop*/})
//    this.on('error', (err, payload, currentState) => {
//       Analytics.log(err, payload, currentState);
//     })
//   }
//   loadLocalData(){
//
//       AsyncStorage.getItem('FavoritesStore')
//         .then((value) => {
//           if (value !== null){
//             // get data from local storage
//             alt.bootstrap(value);
//           }
//         })
//         .catch((err) => {
//         })
//   }
//   handleInitializeFavorites(){
//
//     this.setState({
//       matches: this.state.matches
//     });
//         // get data from server
//
//   }
//
//
//   removeMatch(matchID){
//     const cleanFavorites = _.reject(this.state.matches, match => match.id === matchID);
//
//       this.setState({
//         matches: cleanFavorites
//       });
//
//   }
//
//   handleToggleFavorite(matchesData){
//   }
//
//
//   handleGetMatches(matchesData) {
//   }
//
//   handleGetFavorites(matchesData) {
//    var matches = matchesData.matches
//
//     if(matches.length){
//       if(matchesData.page){
//
//         this.setState({
//           matches: [...this.state.matches, ...matches]
//         });
//
//       }else{
//         if(!this.state.matches.length){
//            this.setState({
//               matches: [ ...matches]
//             });
//         }else{
//
//           var allmatches = this.state.matches;
//
//           allmatches.slice(0,19)
//
//           this.setState({
//             matches: [...matches, ...allmatches]
//           });
//         }
//      }
//
//    }else{
//       this.setState({
//         matches: [...this.state.matches]
//       });
//     }
//
//   }
//
//   // public methods
//
//   getAllFavorites(){
//     return this.getState().matches
//    }
//
//   getMatchInfo(matchID){
//     const matches = this.getState().matches
//     var m = _.filter(matches,(ma,i) => { return ma.match_id == matchID })
//
//     return m[0]
//
//   }
//
// }
//
//  function orderFavorites(matches){
//    var _threads = matches;
//
//     var orderedThreads = [];
//
//     for (var id in _threads) {
//       var thread = _threads[id];
//       orderedThreads.push(thread);
//     }
//     // wrong formatting, rensmr lastMessage
//     orderedThreads.sort(function(a, b) {
//       if (a.recent_message.created_timestamp < b.recent_message.created_timestamp) {
//         return 1;
//       } else if (a.recent_message.created_timestamp > b.recent_message.created_timestamp) {
//         return -1;
//       }
//       return 0;
//     });
//
//     return orderedThreads;
//
//
//   }
//
// export default alt.createStore(FavoritesStore, 'FavoritesStore')
//
