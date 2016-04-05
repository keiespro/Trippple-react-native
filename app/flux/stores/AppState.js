import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import {AsyncStorage,PushNotificationIOS,NativeModules,Settings} from 'react-native'
const {CameraManager,OSPermissions} = NativeModules
import AddressBook from 'react-native-addressbook'
import Analytics from '../../utils/Analytics'

class AppStateStore {

  constructor() {

    this.userStatus = null
    this.showCheckmark = false
    this.checkmarkRequireButtonPress = false
    this.checkMarkCopy = {}
    this.currentRoute = null
    this.showOverlay = false
    this.showMaintenanceScreen = false
    this.permissions = {
      camera: null,
      cameraRoll: null,
      contacts: null,
      location: null,
      notifications: null,

    }
    this.OSPermissions = {...OSPermissions }

    this.bindListeners({
      handleInitialize: AppActions.GOT_CREDENTIALS,
      handleNewInitialize: AppActions.NO_CREDENTIALS,
      handleGetUserInfo: UserActions.GET_USER_INFO,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleLogOut: UserActions.LOG_OUT,
      handleHideCheckmark: AppActions.HIDE_CHECKMARK,
      handleShowCheckmark: AppActions.SHOW_CHECKMARK,
      handleSelectPartner: UserActions.SELECT_PARTNER,
      handleUpdateRoute: AppActions.UPDATE_ROUTE,
      handleToggleOverlay: AppActions.TOGGLE_OVERLAY,
      handleSentTelemetry: AppActions.SEND_TELEMETRY,
      handleShowMaintenanceScreen: AppActions.SHOW_MAINTENANCE_SCREEN,
      handleScreenshot: AppActions.SCREENSHOT

    });

    this.exportPublicMethods({
      getAppState: this.getAppState
    })


    this.on('init', () => {
      Analytics.all('INIT App State Store');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR App State Store',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP App State Store',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      Analytics.all('AFTEREACH App State store', ...{...x});
    });

  }

  handleNewInitialize(){


  }

  handleInitialize(){

    UserActions.getUserInfo.defer()

  }
  handleTogglePermission(permission,value){

//     const perms = this.permissions
//     perms[permission] = value
//     this.saveToLocalStorage(permission,value)
//     this.setState({permissions:perms})
  }
  handleSentTelemetry(result){

  }
  handleGrantPermission(permission){
    // this.handleTogglePermission(permission, true)
  }
  handleDenyPermission(permission){
    // this.handleTogglePermission(permission, true)
  }

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

  }

  handleScreenshot(path){
    console.log('got screenshot at '+path)
  }
  //

  getAppState(){
    return this.getState()
  }



}
export default alt.createStore(AppStateStore, 'AppStateStore');
