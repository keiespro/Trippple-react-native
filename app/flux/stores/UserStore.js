var alt = require('../alt');
var UserActions = require('../actions/UserActions');
var Keychain = require('Keychain');

const server = 'http://api2.trippple.co';

class UserStore {
  constructor() {

    this.state = {
      user_id: null,
      apikey: null,
      user: {}
    }

    this.exportPublicMethods({
      getUser: this.getUser

    });

    this.bindListeners({
      handleGetUserInfo: UserActions.GET_USER_INFO,
      handleLogin: UserActions.LOGIN,
      handleRegister: UserActions.REGISTER,
      handleVerifyPin: UserActions.VERIFY_SECURITY_PIN,
      handleUpdateUser: UserActions.UPDATE_USER



    });
  }

  handleVerifyPin(response){
    var u = this.user;
    console.log(u);
    u.status = response.status;
    this.setState({
      user: u
    })

  }

  handleGetUserInfo(user) {
    this.setState({
      user: user
    })
  }

  handleRegister(response) {
    console.log(response);

    Keychain
      .setInternetCredentials(server, response.user_id, response.api_key)
      .then(()=> {
        console.log('Credentials saved successfully!')
        this.setState({
          user_id: response.user_id,
          apikey: response.api_key,
          user: response.user_info
        });

      });

  }

  handleLogin(response) {
    console.log('Handle login', response);

    Keychain
      .setInternetCredentials(server, response.user_id, response.api_key)
      .then(()=> {
        console.log('Credentials saved successfully!')
        this.setState({
          user_id: response.user_id,
          apikey: response.api_key,
          user: response.user_info
        });

    });
  }

  handleUpdateUser(wrap){
    var updatedUser = this.user;
    Object.assign(updatedUser,wrap.updates);
    this.setState({user:updatedUser});
  }

  getUser(){

    return this.getState().user;

  }
}

module.exports = alt.createStore(UserStore, 'UserStore');
