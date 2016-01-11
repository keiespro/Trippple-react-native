import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage,AlertIOS } from 'react-native'
import NotificationActions from '../actions/NotificationActions'
import _ from 'underscore'

class PotentialsStore {

  constructor() {

    this.potentials = []
    this.hasSentAnyLikes = false

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE
    });

    this.on('init', () => {/*noop*/});

    this.on('error', (err, payload, currentState) => {
      console.warn(err, payload, currentState);
    });

    this.exportPublicMethods({
      getAll: this.getAll
    });
  }

  handleGetPotentials(data) {
    if(data.matches.length){
      var potentials;
      if(!data.matches[0].user){
        potentials = data.matches.map((pot,i)=>{
          return {user: pot}
        })
      }else{
        potentials = data.matches
      }
      this.potentials = data.matches
    }
  }

  handleSentLike(payload){

    if(payload.matches && payload.matches.length > 0){
      this.handleGetPotentials(payload)
    }else{
      var {likedUserID,likeStatus} = payload
      if(likeStatus == 'approve' && !this.hasSentAnyLikes){
        const relevantUser = _.findWhere(this.potentials,(el,i)=>{
          return el.user.id == likedUserID
        })
      }
      const newPotentials = this.potentials.filter((el,i)=>{
        return el.user.id != likedUserID
      })
      this.setState({potentials:newPotentials, hasSentAnyLikes:true})
    }
  }

  getAll(){
    return this.getState().potentials;
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
