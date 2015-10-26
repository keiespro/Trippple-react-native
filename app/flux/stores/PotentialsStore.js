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
    this.on('error', (err, payload, currentState) => {
        console.log(err, payload);
    })

    this.exportPublicMethods({
      getAll: this.getAll
    })
  }

  handleGetPotentials(data) {
    console.log(data,'POTENTIALS');

    if(data.matches.length){
      var potentials;
      if(!data.matches[0].user){
        potentials = data.matches.map((pot,i)=>{
          return {user: pot}
        })
      }else{
        potentials = data.matches
      }
      this.potentials = potentials
    }
  }

  handleSentLike(payload){
    console.log(payload)
    if(payload.matches && payload.matches.length > 0){
      this.handleGetPotentials(payload)
    }else{
      var likedUserID = payload

      const newPotentials = this.potentials.filter((el,i)=>{
        return el.user.id != likedUserID
      })
      console.log(newPotentials)
      this.setState({potentials:newPotentials})
    }
  }

  getAll(){
    return this.getState().potentials;
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
