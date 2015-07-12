var alt = require('../alt');
var UserActions = require('../actions/UserActions');
var Keychain = require('Keychain');

var server = 'http://api2.trippple.co';

class UserStore {
  constructor() {

    this.state = {
      user: {}
    }

    this.exportPublicMethods({
      getUser: this.getUser

    });

    this.bindListeners({
      handleGetUserInfo: UserActions.GET_USER_INFO,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleRequestPin: UserActions.REQUEST_PIN_LOGIN,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleUpload: UserActions.UPLOAD_IMAGE
    });
  }
  handleRequestPin(res){
  }

  handleVerifyPin(res){
    if(res.error) return false;

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

  handleGetUserInfo(user) {
    this.setState({
      user: user
    })
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

  updateUserInfo(attributes){
    var updatedUser = this.user;
    Object.assign(updatedUser,attributes);
    this.setState({user:updatedUser});
  }

  handleUpdateUser(wrap){
    this.updateUserInfo(wrap.updates);
  }

  handleUpload(response){
    console.log('handleupload');
    UserActions.getUserInfo();
  }
  getUser(){

    return this.getState().user;

  }
}

module.exports = alt.createStore(UserStore, 'UserStore');
