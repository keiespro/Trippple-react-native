import alt from '../alt'
import UserActions from '../actions/UserActions'
import UserSource from '../dataSources/UserSource'
import MatchActions from '../actions/MatchActions'
import AppActions from '../actions/AppActions'
import { datasource } from 'alt/utils/decorators'
import Keychain from 'react-native-keychain'
import CredentialsStore from './CredentialsStore'

import {KEYCHAIN_NAMESPACE} from '../../config'

@datasource(UserSource)
class UserStore {
  constructor() {

    this.user = {}
    this.userStub = {}
    this.state = {
      user: {},
      userStub: {},
    }

    this.registerAsync(UserSource);

    this.exportPublicMethods({
      getUser: this.getUser
    })
    this.bindListeners({
      handleBlockContacts: AppActions.STORE_CONTACTS_TO_BLOCK,
      handleInitialize: AppActions.GOT_CREDENTIALS,
      handleInitSuccess: UserActions.INIT_SUCCESS,
      handleGetUserInfo: UserActions.getUserInfo,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleRequestPin: UserActions.REQUEST_PIN_LOGIN,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleUpload: UserActions.UPLOAD_IMAGE,
      handleUpdateUserStub: UserActions.updateUserStub,
      handleLogOut: UserActions.LOG_OUT,
      handlePartner: UserActions.SELECT_PARTNER

    });

  }

  handleInitialize(){

    this.getInstance().initUser()

  }

  handleInitSuccess(res){
    const user = res.response.user_info
    this.setState({ user })
    if(user.status == 'onboarded'){
      MatchActions.getPotentials.defer();
      MatchActions.getMatches.defer();
      MatchActions.getFavorites.defer();
    }
  }

  handleBlockContacts(){

  }

  handleRequestPin(res){

  }

  handleVerifyPin(res){
    const {user_info} = res.response;

    CredentialsStore.saveCredentials(res.response)

    this.setState({
      user: {  ...this.user, ...user_info },
    })

    if(user_info.status == 'onboarded'){
      MatchActions.getPotentials.defer();
      MatchActions.getMatches.defer();
      MatchActions.getFavorites.defer();
    }
  }

  handleGetUserInfo(res){
    if(res.error){
      return false;
    }

    var user = res.response.user_info;

    this.setState({
      user: {...this.state.user, ...user}
    })
  }


  handleUpdateUserStub(attributes = {}){
    console.log('handleUpdateUserStub',attributes,...this.state.userStub)

    var updatedUserStub = {...this.state.userStub, ...attributes};
    this.setState({userStub: updatedUserStub});

    if( attributes.ready){

      console.log(this.state.user,this.state.userStub);

      UserActions.updateUser(updatedUserStub)

    }else{

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

  handlePartner(){
    this.handleUpdateUserStub({relationship_status:'couple'})
  }


  updateUserInfo(attributes){
    const prevUser = this.state.user;
    const updatedUser = {...prevUser, ...attributes};
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
