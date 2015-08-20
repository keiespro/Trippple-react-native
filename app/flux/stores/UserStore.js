import alt from '../alt';
import UserActions from '../actions/UserActions';
import Keychain from 'Keychain';

const server = 'http://api.trippple.co';

class UserStore {
  constructor() {

    this.state = {
      user: {},
      userStub: {}
    }

    this.exportPublicMethods({
      getUser: this.getUser
    });

    this.bindListeners({
      handleGetUserInfo: UserActions.getUserInfo,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleRequestPin: UserActions.REQUEST_PIN_LOGIN,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleUpload: UserActions.UPLOAD_IMAGE,
      handleInitialize: UserActions.INITIALIZE,
      handleUpdateUserStub: UserActions.updateUserStub,
      handleLogOut: UserActions.LOG_OUT
    });


  }

  handleRequestPin(res){

  }

  handleVerifyPin(res){
    if(res.error){
      return false;
    }

    var {response} = res;

    Keychain.setInternetCredentials(server, response.user_id, response.api_key)
      .then((result)=> {
        console.log('Credentials saved successfully!',result)
      });

    var u = this.state.user || {};

    u.id = response.user_id;
    u.status = response.status;
    u.api_key = response.api_key;

    this.setState({
      user: u,
      status: u.status,
      user_id: u.id,
      apikey: u.api_key
    })


  }

  handleInitialize(res){
    if(res.error){
      return false;
    }

    var user = res.response.user_info;

    this.setState({
      user: user,
      status: user.status,
      user_id: user.id,
      apikey: user.api_key
    })
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
  // handleRegister(response) {
  //   console.log(response);
  //
  //   Keychain
  //     .setInternetCredentials(server, response.user_id, response.api_key)
  //     .then(()=> {
  //       console.log('Credentials saved successfully!')
  //       this.setState({
  //         user_id: response.user_id,
  //         apikey: response.api_key,
  //         user: response.user_info
  //       });
  //
  //     });
  //
  // }

  // handleLogin(response) {
  //   console.log('Handle login', response);
  //
  //   Keychain
  //     .setInternetCredentials(server, response.user_id, response.api_key)
  //     .then(()=> {
  //       console.log('Credentials saved successfully!')
  //       this.setState({
  //         user_id: response.user_id,
  //         apikey: response.api_key,
  //         user: response.user_info
  //       });
  //
  //   });
  // }

  handleLogOut(){
    this.setState({user:{}});

  }
  updateUserInfo(attributes){
    const updatedUser = {...this.state.user, ...attributes};
    this.setState({user:updatedUser});
  }

  handleUpdateUser(wrap){
    this.updateUserInfo(wrap.updates);
  }

  handleUpload(response){
    UserActions.getUserInfo();
  }

  getUser(){

    return this.getState().user;

  }
}
export default alt.createStore(UserStore, 'UserStore');
