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
    this.showCheckmark = false
    this.userStub = {}
    this.state = {
      user: {},
      userStub: {},
      showCheckmark:false
    }

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
      handleLogOut: UserActions.LOG_OUT,
      handleHideCheckmark: AppActions.HIDE_CHECKMARK,
      handleShowCheckmark: AppActions.SHOW_CHECKMARK,
      handleSelectPartner: UserActions.SELECT_PARTNER

    });

  }

  handleInitialize(){

    this.getInstance().initUser()

  }

  handleInitSuccess(res){
  console.log('init success',res);
    this.setState({
      user: res.response.user_info
    })
    MatchActions.getPotentials();

     MatchActions.getMatches();
     MatchActions.getFavorites();


  }
  handleBlockContacts(){

  }

  handleRequestPin(res){

  }

  handleVerifyPin(res){
    console.log(res)
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

    CredentialsStore.saveCredentials(user_info);
  }
  handleGetUserInfo(res){
    console.log(res)
    if(res.error){
      return false;
    }

    var user = res.response.user_info;

    this.setState({
      user: {...this.state.user, ...user}
    })
  }

  handleShowCheckmark(cm){
    var cm = cm || {};
    this.setState({
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
