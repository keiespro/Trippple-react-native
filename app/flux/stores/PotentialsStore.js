import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage,Alert,Settings,NativeModules } from 'react-native'
import NotificationActions from '../actions/NotificationActions'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'
var {OSPermissions} = NativeModules


class PotentialsStore {

  constructor() {

    this.potentials = []
    this.hasSeenNotificationPermission = JSON.parse(OSPermissions.notifications) ||  Settings.get('co.trippple.HasSeenNotificationRequest')
    this.LastNotificationsPermissionRequestTimestamp = Settings.get('co.trippple.LastNotificationsPermissionRequestTimestamp') || null,
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
      // Analytics.all('INIT PotentialsStore');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR PotentialsStore',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP PotentialsStore',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      if(x.payload && x.payload.payload && x.payload.payload.matches && x.payload.payload.matches.length){
        Analytics.all('UPDATE Potentials Store', {...x});
      }
    });

    this.exportPublicMethods({
      getAll: this.getAll,
      getMeta: this.getMeta
    });
  }

  handleGetPotentials(data) {
    if(data && data.matches.length){
      var potentials;


      Analytics.extra('Sanity Check',{
        type: 'API response',
        name: 'Receive New Potentials',
        value: data.matches.length
      })

      if(!data.matches[0].user){
        potentials = data.matches.map((pot,i)=>{
          return {user: pot}
        })
      }else{
        potentials = data.matches
      }
      this.potentials = data.matches
    }else{
      Analytics.extra('Sanity Check',{
        type: 'API response',
        name: 'Receive New Potentials',
        value: 0
      })
    }
  }

  handleGetFakePotentials(data) {
    if(data && data.matches.length){
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

    Analytics.event('Interaction',{
      type: 'User',
      name: 'Log out',
    })


    this.setState({
      potentials: [],
      LastNotificationsPermissionRequestTimestamp: false
    })
  }
  handleShowNotificationModalWithLikedUser(likedUser){
    // this.setState({ requestNotificationsPermission:true, relevantUser: likedUser})
    // this.emitChange()

  }
  handleDisableNotificationModal(){

    this.setState({
      LastNotificationsPermissionRequestTimestamp: Date.now(),
      requestNotificationsPermission:false,
      hasSeenNotificationPermission: true,
      relevantUser: null
    })

  }
  handleSentLike(payload){

    if(payload.matches && payload.matches.length > 0){
      this.handleGetPotentials(payload)
    }else{
      var {likedUserID,likeStatus} = payload

      const potentials = this.potentials || []
      const newPotentials = [...potentials].filter((el,i)=>{
        return el.user.id != likedUserID && el.user.partner_id != likedUserID
      })
      const likedUser = _.findWhere(potentials,(el,i)=>{
        return el.user.id == likedUserID || el.user.partner_id == likedUserID
      })

      if(likeStatus == 'approve' && !this.hasSeenNotificationPermission && !this.LastNotificationsPermissionRequestTimestamp ){

        const stringifiedLikedUser = JSON.stringify(this.relevantUser);
        const nowTimestamp = Date.now();

        Settings.set({
          'co.trippple.HasSeenNotificationRequest': true,
          'co.trippple.LastNotificationsPermissionRequestTimestamp':nowTimestamp,
          NotificationSetting: true
        })
        this.setState({
          potentials:newPotentials, relevantUser: likedUser,
          LastNotificationsPermissionRequestTimestamp:nowTimestamp
        })
        AppActions.showNotificationModalWithLikedUser(likedUser);

      }else{
        this.setState({ ...this.state, potentials:newPotentials, relevantUser: likedUser })

      }

    }
  }

  getAll(){
    const {blockedPotentials, potentials} = this.getState()
    return _.filter(potentials, (p)=> blockedPotentials.indexOf(p.id));
  }
  getMeta(){
    return {
      LastNotificationsPermissionRequestTimestamp: this.getState().LastNotificationsPermissionRequestTimestamp,
      relevantUser: this.getState().relevantUser,
      requestNotificationsPermission: this.getState().requestNotificationsPermission,
      hasSeenNotificationPermission: this.getState().hasSeenNotificationPermission
    }
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
