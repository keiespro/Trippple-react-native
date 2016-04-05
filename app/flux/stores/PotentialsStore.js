import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage,AlertIOS } from 'react-native'
import NotificationActions from '../actions/NotificationActions'
import UserActions from '../actions/UserActions'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'


class PotentialsStore {

  constructor() {

    this.potentials = []
    this.hasSentAnyLikes = false
    this.blockedPotentials = []

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE,
      handleLogout: UserActions.LOG_OUT,
      handleRemovePotential: MatchActions.REMOVE_POTENTIAL
    });

    this.on('init', () => {
      Analytics.all('INIT PotentialsStore');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR PotentialsStore',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP PotentialsStore',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      Analytics.all('AFTEREACH Potentials Store', {...x});
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

  handleRemovePotential(id){
    const p = this.state.potentials;
    p.unshift();
    this.setState({
      potentials: p,
      blockedPotentials: [...this.state.blockedPotentials, id]
    })

  }
  handleLogout(){
    this.setState({
      potentials: [],
      hasSentAnyLikes: false
    })
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
    const {blockedPotentials, potentials} = this.getState()
    return _.filter(potentials, (p)=> blockedPotentials.indexOf(p.id));
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
