import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import {AsyncStorage} from 'react-native'





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

      this.permissions = await storedPermissions
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
    this.handleTogglePermission(permission, false)
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
    const user_info = res.response;

    this.setState({
      user: {  ...this.user, ...user_info },
      showCheckmark: true,
      checkMarkCopy: {
        title: '',

      },
      checkmarkRequireButtonPress: false

    })


    setTimeout(()=>{
      this.setState({showCheckmark:false})
    },1000);

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

  handleShowCheckmark(cm){
    var cm = cm || {};
    this.setState({
      showOverlay:false,
      showCheckmark: true,
      checkMarkCopy: cm ? cm.copy : {} ,
      checkmarkRequireButtonPress: cm  && cm.button
    })

    if(!cm.button){
      setTimeout(()=>{
        this.setState({showCheckmark:false,checkMarkCopy: {}})
      },5000);
    }

  }

  handleHideCheckmark(){

    this.setState({
      showCheckmark: false,
      checkMarkCopy: {}
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
        });
      }
  }


  handleUpdateRoute({route,match_id}){
    console.log({route,match_id})
    this.currentRoute = {route,match_id};

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
