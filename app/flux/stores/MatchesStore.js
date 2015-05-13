var alt = require('../alt');
var ChatActions = require('../actions/ChatActions');



class MatchesStore {

  constructor() {

    this.state = {
      matches: []
    }

    this.exportPublicMethods({
      getAllMatches: this.getAllMatches
    });

    this.bindListeners({
      handleGetMatches: ChatActions.GET_MATCHES,
      handleInitializeMatches: ChatActions.INITIALIZE_MATCHES

    });
    this.on('init',()=>{
      console.log('init')
      // alt.bootstrap(savedMatches);
    })
    this.on('bootstrap', () => {
      // do something here
      console.log('BOOTSRAP')
    });
  }

  handleInitializeMatches(savedMatches){
    // alt.bootstrap(savedMatches);

    console.log('handleInitializeMatches')
  }

  handleGetMatches(matches) {
    console.log(matches,'handlegetmatches');
    this.setState({
      matches: matches
    });


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

module.exports = alt.createStore(MatchesStore, 'MatchesStore');
