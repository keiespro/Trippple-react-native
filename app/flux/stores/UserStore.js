import alt from '../alt'
import UserActions from '../actions/UserActions'
import UserSource from '../dataSources/UserSource'
import AppActions from '../actions/AppActions'
import { datasource } from 'alt/utils/decorators'
import Keychain from 'react-native-keychain'
import CredentialsStore from './CredentialsStore'

const KEYCHAIN_NAMESPACE =  'trippple.co'

@datasource(UserSource)
class UserStore {
  constructor() {

    this.user = {}
    this.userStub = {}

    this.registerAsync(UserSource);

    this.exportPublicMethods({
      getUser: this.getUser
    })
    this.bindListeners({
      handleInitialize: AppActions.GOT_CREDENTIALS,
      handleInitSuccess: UserActions.INIT_SUCCESS,
      handleGetUserInfo: UserActions.getUserInfo,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleRequestPin: UserActions.REQUEST_PIN_LOGIN,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleUpload: UserActions.UPLOAD_IMAGE,
      handleUpdateUserStub: UserActions.updateUserStub,
      handleLogOut: UserActions.LOG_OUT
    });

  }

  handleInitialize(){

    this.getInstance().initUser()

  }

  handleInitSuccess(res){
    this.setState({
      user: res.response.user_info
    })

  }

  handleRequestPin(res){

  }

  handleVerifyPin(res){

    const user_info = {};

    user_info.id = res.response.user_id;
    user_info.status = res.response.status;

    this.setState({
      user: {  ...user_info }
    })
    CredentialsStore.saveCredentials(res.response);
  }
  handleGetUserInfo(res){
    console.log(res)
    if(res.error){
      return false;
    }

    var user = res.response.user_info;

    this.setState({
      user: user
    })
  }

  handleUpdateUserStub(attributes = []){

    var updatedUserStub = {...this.state.userStub, ...attributes};

    if(updatedUserStub.gender && updatedUserStub.privacy){
      this.setState({user: {...this.state.user, ...this.state.updatedUserStub}});
    }else{
      this.setState({userStub: updatedUserStub});

    }

  }

  handleLogOut(){
    this.setState({ user:{}, userStub: null});
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE)
    .then(() => {
      console.log('Credentials successfully deleted');
      this.setState({  api_key: null, user_id: null });
    })


  }

  updateUserInfo(attributes){
    const updatedUser = {...this.state.user, ...attributes};
    this.setState({user:updatedUser});
  }

  handleUpdateUser(wrap){
    this.updateUserInfo(wrap.updates);
  }

  handleUpload(response){
    const updatedUser = {...this.state.user, ...response.user_info};
    this.setState({user:updatedUser});

  }

  getUser(){

    return this.getState().user;

  }
}
export default alt.createStore(UserStore, 'UserStore');
