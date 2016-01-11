import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import {AsyncStorage,PushNotificationIOS,NativeModules} from 'react-native'
const {CameraManager,OSPermissions} = NativeModules
import AddressBook from 'react-native-addressbook'


import Log from '../../Log'


class AppStateStore {

  constructor() {

    this.userStatus = null
    this.showCheckmark = false
    this.checkmarkRequireButtonPress = false
    this.checkMarkCopy = {}
    this.currentRoute = null
    this.showOverlay = false
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
    });

    this.exportPublicMethods({
      getAppState: this.getAppState
    })

    this.on('error', (err, payload, currentState) => {
      __DEV__ && __DEBUG__ &&  console.warn(err, payload, currentState);
    })
    // this.on('init', async () => {

      // var storedPermissions = Object.keys(this.permissions).reduce( async (aggregator, key)=>{
      //   let val = await AsyncStorage.getItem(key)
      //   aggregator[key] = await val == 'true'
      //   return await aggregator
      // },{})
      // var updatedPermissions = await storedPermissions
      // const newPermissions  = { ...this.permissions, ...updatedPermissions }

      // this.setState({permissions:newPermissions})
    // })
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
    //
    if(!cm || !cm.button){
      setTimeout(()=>{
        this.setState({showCheckmark:false,checkMarkCopy: {},checkmarkRequireButtonPress:false})
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


  handleUpdateRoute(payload){
    this.currentRoute = payload;
  }

  handleLogOut(){
    this.setState({ userStatus: null});
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
  //

  getAppState(){
    return this.getState()
  }



}
export default alt.createStore(AppStateStore, 'AppStateStore');
