import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage,AlertIOS,Settings } from 'react-native'
import NotificationActions from '../actions/NotificationActions'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'
console.log(alt);

class PotentialsStore {

  constructor() {

    this.potentials = []
    this.hasSentAnyLikes = false
    this.blockedPotentials = []

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleGetFakePotentials: MatchActions.GET_FAKE_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE,
      handleLogout: UserActions.LOG_OUT,
      handleRemovePotential: MatchActions.REMOVE_POTENTIAL,
      handleShowNotificationModalWithLikedUser: AppActions.SHOW_NOTIFICATION_MODAL_WITH_LIKED_USER,
      handleDisableNotificationModal: AppActions.DISABLE_NOTIFICATION_MODAL
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
      Analytics.all('UPDATE Potentials Store', {...x});
    });

    this.exportPublicMethods({
      getAll: this.getAll,
      getMeta: this.getMeta
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

  handleGetFakePotentials(data) {
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
    const p = this.potentials;
    p.unshift();
    this.setState({
      potentials: p,
      blockedPotentials: [...this.blockedPotentials, id]
    })

  }
  handleLogout(){
    this.setState({
      potentials: [],
      hasSentAnyLikes: false
    })
  }
  handleShowNotificationModalWithLikedUser(likedUser){
    this.setState({ requestNotificationsPermission:true, relevantUser: likedUser})
    this.emitChange()

  }
  handleDisableNotificationModal(){

    this.setState({ requestNotificationsPermission:false, relevantUser: null})

  }
  handleSentLike(payload){

    if(payload.matches && payload.matches.length > 0){
      this.handleGetPotentials(payload)
    }else{
      var {likedUserID,likeStatus} = payload
      if(likeStatus == 'approve' && !Settings.get('HasSeenNotificationRequest')){
        const likedUser = _.findWhere(this.potentials,(el,i)=>{
          return el.user.id == likedUserID
        })
        const stringifiedLikedUser = JSON.stringify(likedUser);
        Settings.set({HasSeenNotificationRequest: stringifiedLikedUser})
        this.setState({potentials:newPotentials, requestNotificationsPermission:true, relevantUser: likedUser})

      }
      const potentials = this.potentials || []
      const newPotentials = [...potentials].filter((el,i)=>{
        return el.user.id != likedUserID
      })
      this.setState({potentials:newPotentials, hasSentAnyLikes:true})
    }
  }

  getAll(){
    const {blockedPotentials, potentials} = this.getState()
    return _.filter(potentials, (p)=> blockedPotentials.indexOf(p.id));
  }
  getMeta(){
    return {relevantUser: this.getState().relevantUser, requestNotificationsPermission: this.getState().requestNotificationsPermission}
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
