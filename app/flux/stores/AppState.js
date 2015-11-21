import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import {AsyncStorage,PushNotificationIOS,NativeModules} from 'react-native'
const {CameraManager,OSPermissions} = NativeModules
import AddressBook from 'react-native-addressbook'




class AppStateStore {

  static config = {


  }
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
    console.log(OSPermissions)
    this.OSPermissions = {...OSPermissions }

    this.bindListeners({
      handleInitialize: AppActions.GOT_CREDENTIALS,
      handleInitSuccess: UserActions.INIT_SUCCESS,
      handleGetUserInfo: UserActions.GET_USER_INFO,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleLogOut: UserActions.LOG_OUT,
      handleHideCheckmark: AppActions.HIDE_CHECKMARK,
      handleShowCheckmark: AppActions.SHOW_CHECKMARK,
      handleSelectPartner: UserActions.SELECT_PARTNER,
      handleUpdateRoute: AppActions.UPDATE_ROUTE,
      handleToggleOverlay: AppActions.TOGGLE_OVERLAY,
      handleGrantPermission: AppActions.GRANT_PERMISSION,
      handleDenyPermission: AppActions.DENY_PERMISSION
    });

    this.exportPublicMethods({
      getAppState: this.getAppState
    })

    this.on('error', (err, payload, currentState) => {
        console.log(err, payload);
    })

    this.on('init', async () => {

      var storedPermissions = Object.keys(this.permissions).reduce( async (aggregator, key)=>{
        let val = await AsyncStorage.getItem(key)
        aggregator[key] = await val == 'true'
        return await aggregator
      },{})
      var updatedPermissions = await storedPermissions
      const newPermissions  = { ...this.permissions, ...updatedPermissions }

      this.setState({permissions:newPermissions})
    })
  }


  handleInitialize(){


  }
  handleTogglePermission(permission,value){

    const perms = this.permissions
    perms[permission] = value
    this.saveToLocalStorage(permission,value)
    this.setState({permissions:perms})
    console.log('PERMISSION '+(value ? 'GRANTED: ' : 'DENIED: '+ permission))
  }

  handleGrantPermission(permission){
    this.handleTogglePermission(permission, true)
  }
  handleDenyPermission(permission){
    this.handleTogglePermission(permission, true)
  }

  async saveToLocalStorage(permission, value){
    try {
      await AsyncStorage.setItem(`${permission}`, (value.toString()))
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
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

  handleInitSuccess(res){
    this.setState({
      userStatus: res.response.user_info.status
    })

  }

  handleGetUserInfo(res){
    if(res.error){
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
    console.log(payload);
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
    console.log(payload)
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
