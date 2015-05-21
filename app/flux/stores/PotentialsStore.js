var alt = require('../alt');
var ChatActions = require('../actions/ChatActions');
var AsyncStorage = require('react-native').AsyncStorage;


class PotentialsStore {

  constructor() {

    this.state = {
      potentials: []
    }

    this.bindListeners({
      handleGetPotentials: ChatActions.GET_POTENTIALS,
      handleSentLike: ChatActions.SEND_LIKE
    });

    this.on('init',()=>{
      console.log('store init')
      ChatActions.getPotentials();

    })
    this.on('bootstrap', () => {
      console.log('store bootstrap');

    });

    this.exportPublicMethods({
      getAll: this.getAll

    });
  }


  handleGetPotentials(potentials) {
    console.log(potentials,'POTENTIALS');
    if(potentials.matches.length){
      this.setState({
        potentials: potentials.matches
      });
    }
  }

  handleSentLike(likedUserID){

    var shifted = this.potentials.shift();
    console.log(shifted[0].id == likedUserID)
    this.setState({
      potentials: this.potentials
    })

  }


  getAll(){
    console.log('POTSTORE',this.getState().potentials)
    return this.getState().potentials || [];

  }




}

module.exports = alt.createStore(PotentialsStore, 'PotentialsStore');
