var alt = require('../alt');
var UserActions = require('../actions/UserActions');
var AsyncStorage = require('react-native').AsyncStorage;


class PotentialsStore {

  constructor() {

    this.state = {
      potentials: []
    }

    this.bindListeners({
      handleGetPotentials: UserActions.GET_POTENTIALS
    });

    this.on('init',()=>{
      console.log('store init')

    })
    this.on('bootstrap', () => {
      console.log('store bootstrap');

    });
  }


  handleGetPotentials(potentials) {
    console.log(potentials,'handlegetmatches');
    if(potentials.length){
      this.setState({
        potentials: potentials
      });
    }

  }





}

module.exports = alt.createStore(PotentialsStore, 'PotentialsStore');
