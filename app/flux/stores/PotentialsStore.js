import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage } from 'react-native'

class PotentialsStore {

  constructor() {

    this.potentials = []

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE
    });

    this.on('init',()=>{
      console.log('potentials store init')
    })

    this.on('bootstrap', () => {
    })

    this.exportPublicMethods({
      getAll: this.getAll
    })
  }

  handleGetPotentials(data) {
    console.log(data,'POTENTIALS');

    if(data.matches.length){
      this.potentials = data.matches
    }
  }

  handleSentLike(likedUserID){
    const newPotentials = this.potentials.filter((el,i)=>{
      return (el.id !== likedUserID) && (el.user.id !== likedUserID) && (el.partner.id !== likedUserID)
    })

   this.potentials =  this.potentials.length ? newPotentials : []
  }

  getAll(){
    return this.getState().potentials;
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
