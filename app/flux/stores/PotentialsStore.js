import alt from '../alt'
import MatchActions from '../actions/MatchActions'
import { AsyncStorage,Alert,Settings,NativeModules,PushNotificationIOS } from 'react-native'
import NotificationActions from '../actions/NotificationActions'
import UserActions from '../actions/UserActions'
import AppActions from '../actions/AppActions'
import _ from 'underscore'
import Analytics from '../../utils/Analytics'

import { HAS_SEEN_NOTIFICATION_REQUEST, LAST_ASKED_NOTIFICATION_PERMISSION, NOTIFICATION_SETTING, LEGACY_NOTIFICATION_SETTING } from '../../utils/SettingsConstants'

const {OSPermissions} = NativeModules


class PotentialsStore {

  constructor() {

    this.potentials = [];
    this.hasSeenNotificationPermission = Settings.get(HAS_SEEN_NOTIFICATION_REQUEST) || Settings.get(NOTIFICATION_SETTING) || Settings.get(LEGACY_NOTIFICATION_SETTING) || JSON.parse(OSPermissions.notifications);
    this.LastNotificationsPermissionRequestTimestamp = Settings.get(LAST_ASKED_NOTIFICATION_PERMISSION) || null;

    this.blockedPotentials = [];

    this.bindListeners({
      handleGetPotentials: MatchActions.GET_POTENTIALS,
      handleGetFakePotentials: MatchActions.GET_FAKE_POTENTIALS,
      handleSentLike: MatchActions.SEND_LIKE,
      handleLogout: UserActions.LOG_OUT,
      handleRemovePotential: MatchActions.REMOVE_POTENTIAL,
      handleShowNotificationModalWithLikedUser: AppActions.SHOW_NOTIFICATION_MODAL_WITH_LIKED_USER,
      handleDisableNotificationModal: AppActions.DISABLE_NOTIFICATION_MODAL,
      handleGotNotificationPermissionFromLike: NotificationActions.RECEIVE_APN_TOKEN
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

        // const partialSnapshot = alt.takeSnapshot( this );
        // Analytics.log( 'saving', partialSnapshot );
        // AsyncStorage.setItem( 'PotentialsStore', JSON.stringify( partialSnapshot ) );
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
      const got = {};

      this.potentials = data.matches.filter(p => got.hasOwnProperty(p) ? false : (got[p] = true) );



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
    // console.log(likedUser);

  }
  handleDisableNotificationModal(){

    this.setState({
      LastNotificationsPermissionRequestTimestamp: Date.now(),
      requestNotificationsPermission: false,
      hasSeenNotificationPermission: true,
      relevantUser: null
    })


  }

  handleGotNotificationPermissionFromLike(){
    Settings.set({
      [HAS_SEEN_NOTIFICATION_REQUEST]: true,
      [LAST_ASKED_NOTIFICATION_PERMISSION]: nowTimestamp,
      [NOTIFICATION_SETTING]: true
    })

    this.setState({
      relevantUser: null,
      hasSeenNotificationPermission: true
    })

  }

  handleSentLike(payload){
    if(payload.matches && payload.matches.length > 0){
      this.handleGetPotentials(payload)
    }else{
      var {likedUserID,likeStatus} = payload

      if(likeStatus != 'approve' && likeStatus != 'deny') return false;

      const potentials = this.potentials || []
      const newPotentials = [...potentials].filter((el,i)=>{
        return el.user.id != likedUserID && el.user.partner_id != likedUserID
      })
      const likedUser = _.findWhere(potentials,(el,i)=>{
        return el.user.id == likedUserID || el.user.partner_id == likedUserID
      })

      if(likeStatus == 'approve' && !this.hasSeenNotificationPermission && !Settings.get(NOTIFICATION_SETTING)){


        const nowTimestamp = Date.now();

        this.setState({
          potentials: newPotentials,
          relevantUser: likedUser,
          LastNotificationsPermissionRequestTimestamp: nowTimestamp
        })

        AppActions.showNotificationModalWithLikedUser(likedUser);

      }else{
        this.setState({ ...this.state,
          potentials:newPotentials,
          relevantUser: null
        })

      }

    }
  }

  getAll(){
    const {blockedPotentials, potentials} = this.getState()
    return _.filter(potentials, (p)=> blockedPotentials.indexOf(p.id));
  }
  getMeta(){
    const s = this.getState()
    return {
      LastNotificationsPermissionRequestTimestamp: s.LastNotificationsPermissionRequestTimestamp,
      relevantUser: s.relevantUser,
      requestNotificationsPermission: s.requestNotificationsPermission,
      hasSeenNotificationPermission: s.hasSeenNotificationPermission
    }
  }

}

export default alt.createStore(PotentialsStore, 'PotentialsStore');
