var alt = require('../alt');
var MatchActions = require('../actions/MatchActions');
var AsyncStorage = require('react-native').AsyncStorage;
var Logger = require("../../utils/logger");


class PotentialsStore {

  constructor() {

    this.state = {
      potentials: []
    }

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE
    });

    this.on('init',()=>{
      Logger.log('store init')
      MatchActions.getPotentials();

    })
    this.on('bootstrap', () => {
      Logger.log('store bootstrap');

    });

    this.exportPublicMethods({
      getAll: this.getAll

    });
  }


  handleGetPotentials(potentials) {
    Logger.log(potentials,'POTENTIALS');
    if(potentials.matches.length){
      this.setState({
        potentials: potentials.matches
      });
    }
  }

  handleSentLike(likedUserID){

    this.state.potentials ? this.setState({
        potentials: this.state.potentials.filter((el,i)=>{
          return el.id != likedUserID && el[0].id != likedUserID && el[1].id != likedUserID
        })
      }) : null;

  }


  getAll(){
    Logger.log('POTSTORE',this.getState().potentials)
    return this.getState().potentials || [];

  }




}
module.exports = PotentialsStore;
// module.exports = alt.createStore(PotentialsStore, 'PotentialsStore');
