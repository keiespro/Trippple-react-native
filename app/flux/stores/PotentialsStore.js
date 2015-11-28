import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage } from 'react-native'
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
