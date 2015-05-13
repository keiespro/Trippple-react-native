var alt = require('../alt');
var UserActions = require('../actions/UserActions');

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
      handleLogin: UserActions.LOGIN

    });
  }

  handleGetUserInfo(user) {
    this.setState({
      user: user
    })
  }

  handleLogin(response) {
    console.log(response);
    this.setState({
      user_id: response.user_id,
      apikey: response.api_key,
      user: response.user_info
    })

  }

  getUser(){
    console.log('getuser',this.state)
    return this.getState().user;

  }
}

module.exports = alt.createStore(UserStore, 'UserStore');
