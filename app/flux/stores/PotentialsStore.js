import alt from '../alt';
import MatchActions from '../actions/MatchActions';
import { AsyncStorage } from 'react-native';

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
      console.log('potentials store init')
      MatchActions.getPotentials();

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
    const newPotentials = this.state.potentials.filter((el,i)=>{
      return (el.id !== likedUserID) && (el.user.id !== likedUserID) && (el.partner.id !== likedUserID)
    })

    this.state.potentials.length ? this.setState({ potentials: newPotentials }) : null
  }

  getAll(){
    return this.getState().potentials || [];
  }

}
export default PotentialsStore
// export default alt.createStore(PotentialsStore, 'PotentialsStore');
