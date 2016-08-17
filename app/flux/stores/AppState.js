import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import NotificationActions from '../actions/NotificationActions'
import {AsyncStorage,PushNotificationIOS,NativeModules,Settings} from 'react-native'
const {CameraManager,OSPermissions} = NativeModules
import Analytics from '../../utils/Analytics'
import CoupleReady from '../../coupling/CoupleReady'
import Coupling from '../../coupling'

class AppStateStore {

  constructor() {

    this.userStatus = null
    this.showCheckmark = false
    this.checkmarkRequireButtonPress = false
    this.checkMarkCopy = {}
    this.currentRoute = null
    this.showOverlay = false
    this.showMaintenanceScreen = false
    this.OSPermissions = {...OSPermissions }
    this.showCoupling = false;
    this.modals = [];

    // this.bindListeners({
    //   handleInitialize: AppActions.GOT_CREDENTIALS,
    //   handleNewInitialize: AppActions.NO_CREDENTIALS,
    //   handleGetUserInfo: UserActions.GET_USER_INFO,
    //   handleUpdateUser: UserActions.UPDATE_USER,
    //   handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
    //   handleLogOut: UserActions.LOG_OUT,
    //   handleHideCheckmark: AppActions.HIDE_CHECKMARK,
    //   handleShowCheckmark: AppActions.SHOW_CHECKMARK,
    //   handleSelectPartner: UserActions.SELECT_PARTNER,
    //   handleUpdateRoute: AppActions.UPDATE_ROUTE,
    //   handleToggleOverlay: AppActions.TOGGLE_OVERLAY,
    //   handleSentTelemetry: AppActions.SEND_TELEMETRY,
    //   handleShowMaintenanceScreen: AppActions.SHOW_MAINTENANCE_SCREEN,
    //   handleScreenshot: AppActions.SCREENSHOT,
    //   handleShowInModal: AppActions.SHOW_IN_MODAL,
    //   handleKillModal: AppActions.KILL_MODAL,
    //   handleCoupleCreatedEvent: NotificationActions.RECEIVE_COUPLE_CREATED_NOTIFICATION,
    //   handleOtherCoupleCreatedEvent: UserActions.VERIFY_COUPLE_PIN,
    //   handleSendCoupleInviteMessage: AppActions.SEND_MESSAGE_SCREEN
    //
    // });

    this.exportPublicMethods({
      getAppState: this.getAppState
    })


    this.on('init', () => {
      // Analytics.all('INIT App State Store');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR App State Store',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      // Analytics.all('BOOTSTRAP App State Store',bootstrappedState);
    });
  }

handleSendCoupleInviteMessage(payload){
  const {result} = payload
  this.setState({
    showModal: {
      component: this.lastModal.component,
      passProps: {
        ...this.lastModal.passProps,
        initialScreen:'CouplePin',
        startState: {success: result == 'sent' ? true : false}
      }
    },
    lastModal: null
  })


}
handleOtherCoupleCreatedEvent(){

}

  handleShowInModal(route){

    this.setState({
      showModal: route,
      lastModal: this.showModal
    })
    // this.emitChange()
  }


handleKillModal(){
  this.setState({
    showModal: null,
    lastModal: this.showModal
  })
  // this.emitChange()

}

  handleNewInitialize(){ }

  handleInitialize(){
    UserActions.getUserInfo.defer()
  }

  handleSentTelemetry(result){ }

  saveToLocalStorage(permission, value){
    AsyncStorage.setItem(`${permission}`, (value.toString()))
  }
  handleToggleOverlay(){
    this.setState({
      showOverlay: !this.showOverlay
    })
    setTimeout(()=>{
      this.setState({showOverlay:false})
    },1000);
  }
  handleVerifyPin(res){
    if(res.error){
      return false
    }
    const user_info = res.response,
          prevUser = this.user;

    this.setState({
      user: {  ...prevUser, ...user_info },
      showCheckmark: true,
      checkMarkCopy: {},
      checkmarkRequireButtonPress: false

    })


    setTimeout(()=>{
      this.setState({showCheckmark:false})
    },3000);

  }

  handleGetUserInfo(res){
    if(res.error || !res.response || !res.response.user_info){
      return false;
    }

    this.setState({
      userStatus: res.response.user_info.status
    })
  }

  forceCheckmarkRoute(){
    this.setState({
      currentRoute: {route:'checkmark'},
    })
  }

  handleShowCheckmark(cm){
    this.setState({
      showOverlay: false,
      showCheckmark: true,
      checkMarkCopy: cm ? cm.copy : {} ,
      checkmarkRequireButtonPress: cm  ? cm.button : false
    })

    if(!cm || !cm.button){
      setTimeout(()=>{
        this.setState({showCheckmark:false, checkMarkCopy: {}, checkmarkRequireButtonPress:false})
      },5000);
    }
  }

  handleHideCheckmark(){

    this.setState({
      showCheckmark: false,
      checkMarkCopy: {},
      checkmarkRequireButtonPress:false
    })

  }

  handleSelectPartner(payload){
    if(payload.err){
      return false;
      }
      if(payload.showCheckmark){
        this.handleShowCheckmark({
          copy:{
            title:'INVITATION SENT',
            partnerName: payload.partnerName
          },
          button: true
        })
      }
  }

  handleShowMaintenanceScreen(){
    this.setState({
      showMaintenanceScreen: true
    })
  }

  handleUpdateRoute(payload){
    this.currentRoute = payload;
  }

  handleLogOut(){
    Settings.set({LockedWithTouchID:false})

    this.setState({ userStatus: null });
  }

  //
  // updateUserInfo(attributes){
  //   const prevUser = this.state.user;
  //   const updatedUser = {...prevUser, ...attributes};
  //   this.setState({user:updatedUser});
  // }
  //
  handleUpdateUser(wrap){

    // if(wrap.setWantCouple){
    //   this.setState({
    //     showCoupling: true
    //   })
    // }else if(wrap.generatedCoupleCode){
    //   this.setState({
    //     showCoupling: false
    //   })
    //
    // }


  }

  handleScreenshot(path){
    console.log('got screenshot at '+path)
  }
  //

  handleCoupleCreatedEvent(payload){

    UserActions.getUserInfo.defer()
    MatchActions.getPotentials.defer()

    // if(this.showModal.passProps && !this.showModal.passProps.initialScreen == 'CoupleReady'){
      this.setState({
        showModal: {
          component: Coupling,
          passProps:{
            initialScreen:'CoupleReady'
          }
        },
        lastModal: this.showModal
      })
    // }


  }


  getAppState(){
    return this.getState()
  }



}
export default alt.createStore(AppStateStore, 'AppStateStore');
