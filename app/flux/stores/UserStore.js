import alt from '../alt'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import Keychain from 'react-native-keychain'

import AppState from './AppState'
import Analytics from '../../utils/Analytics'
import {AsyncStorage} from 'react-native'
import config from '../../config'
import Mixpanel from '../../utils/mixpanel'
import SettingsConstants from '../../utils/SettingsConstants'
import {Settings} from 'react-native'
import FBSDK from 'react-native-fbsdk'
const {LoginManager} = FBSDK
const {KEYCHAIN_NAMESPACE} = config

class UserStore {
  constructor() {

    this.user = {}
    this.userStub = {}
    this.state = {
      user: {
        relationship_status: 'single',

      },
      userStub: {},
      couplingData: {}
    }

    this.exportPublicMethods({
      getUser: this.getUser,
      getCouplingData: this.getCouplingData
    })
    //
    // this.bindListeners({
    //   handleBlockContacts: AppActions.STORE_CONTACTS_TO_BLOCK,
    //   handleInitialize: AppActions.GOT_CREDENTIALS,
    //   handleGetUserInfo: UserActions.GET_USER_INFO,
    //   handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
    //   handleRequestPin: UserActions.REQUEST_PIN_LOGIN,
    //   handleUpdateUser: UserActions.UPDATE_USER,
    //   handleUpload: UserActions.UPLOAD_IMAGE,
    //   handleUpdateUserStub: UserActions.UPDATE_USER_STUB,
    //   handleLogOut: UserActions.LOG_OUT,
    //   handlePartner: UserActions.SELECT_PARTNER,
    //   handleUpdateLocally: UserActions.UPDATE_LOCALLY,
    //   handleGetLocation: UserActions.GET_LOCATION,
    //   handleVerifyCouplePin: UserActions.VERIFY_COUPLE_PIN,
    //   handleRequestCouplePin: UserActions.GET_COUPLE_PIN,
    //   handleDecouple: UserActions.DECOUPLE,
    //   handleFBLogin: UserActions.FB_LOGIN
    //
    // });

    this.on('init', () => {
      // Analytics.all('INIT USER store');
    });

    this.on('error', (err, payload, currentState) => {
      Analytics.all('ERROR USER store',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    this.on('bootstrap', (bootstrappedState) => {
      Analytics.all('BOOTSTRAP USER store',bootstrappedState);
    });

    this.on('afterEach', (x) => {
      if(x.payload.payload && (x.payload.payload.response && x.payload.payload.response.user_info || x.payload.payload.updates)){
        Analytics.all('UPDATE USER store', {...x});
        this.save()
      }
    });

  }

  save(){
    let partialSnapshot = alt.takeSnapshot(this);
    Analytics.log('partialSnapshot',partialSnapshot)
    AsyncStorage.setItem('UserStore',JSON.stringify(partialSnapshot));
  }
  handleInitialize(){

    if(this.state.user && this.state.user.status && this.state.user.status == 'onboarded'){
      MatchActions.getPotentials();
      MatchActions.getMatches.defer();
      MatchActions.getFavorites.defer();
    }

  }

  handleBlockContacts(contacts){
    let blob = base64.encode( JSON.stringify(contacts) );
    AsyncStorage.setItem('contacts-blob',JSON.stringify(contacts));

  }

  handleRequestPin(res){

  }

  handleGetLocation(coords){

  }

  handleDecouple(){
    AsyncStorage.clear();
    UserActions.getUserInfo();
  }

  handleFBLogin(login){

    console.log('handleFBLogin',login);
    const {userInfo,userAuth} = login;


    const user =  {  ...this.user, ...userInfo }
    this.setState({ user })

    // if(user_info.status == 'onboarded'){
    //   MatchActions.getPotentials();
    //   MatchActions.getMatches.defer();
    // }

  }
  handleVerifyPin(res){
    const {user_info} = res.response;
    // this.waitFor(AppState)


    this.setState({
      user: {  ...this.user, ...user_info },
    })

    if(user_info.status == 'onboarded'){
      MatchActions.getPotentials();
      MatchActions.getMatches.defer();
      // MatchActions.getFavorites.defer();
    }
  }

  handleGetUserInfo(res={}){
    // console.log(res)
    // if(res.error || !res.response || !res.response.user_info){
    //   return false;
    // }
    const {user_info,client_ip} = res.response;
    Analytics.setUserProperties({"$ip": client_ip})

    this.setState({
      user: {...this.state.user, ...user_info, status: user_info.ready ? 'onboarded' :  user_info.status }
    })

    if( user_info.ready){

      UserActions.updateUser.defer({
        ...this.state.user,
        ...user_info,
        status: user_info.ready ? 'onboarded' :  user_info.status
      })

    }
  }
  handleRequestCouplePin(res){
    this.setState({couplingData: res.response.response});

  }

  handleVerifyCouplePin(res){
    this.setState({couplingData: res.response.response});

    UserActions.getUserInfo();
    this.forceUpdate()
  }

  handleUpdateUserStub(attributes = {}){

    var updatedUserStub = {...this.state.userStub, ...attributes};
    this.setState({userStub: updatedUserStub});

    if( attributes.ready){


      UserActions.updateUser(updatedUserStub)

    }else{

    }
  }

  handleLogOut(){
    console.log(LoginManager);
    this.setState({ user:{}, userStub: null});
    LoginManager.logOut()
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE)
    .then(() => {
      // Log.info('Clearing asyncStorage')

      return AsyncStorage.clear()
    })
    .then(()=>{
      const settingsEraser = {};

      for(let i of SettingsConstants){
        settingsEraser[i] = null
      }

      return Settings.set(settingsEraser)
    })
    .catch((err) => {
      // Log.error(err);
      this.setState({  api_key: null, user_id: null });

    })
    .done()


    this.setState({  api_key: null, user_id: null });

  }

  handlePartner(){
    this.handleUpdateUserStub({relationship_status:'couple'})
  }


  updateUserInfo(attributes){
    const prevUser = this.state.user;
    const updatedUser = {...prevUser, ...attributes};
    this.setState({user:updatedUser, status: attributes.ready ? 'onboarded' :  this.state.user.status});
  }

  handleUpdateUser(res){
    const user = res.response.user_info;
    this.setState({
      user: {...this.state.user, ...user}
    })
  }

  handleUpload(response){

  }

  handleUpdateLocally(payload){
    const updatedUser = {...this.state.user, ...payload};
    this.setState({user:updatedUser})
    this.save()
  }

  getUser(){
    return this.getState().user;

  }

  getCouplingData(){
    return this.getState().couplingData
  }
}
export default alt.createStore(UserStore, 'UserStore');
