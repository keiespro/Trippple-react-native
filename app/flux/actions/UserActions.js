var alt = require('../alt');
var Api = require("../../utils/api");

class UserActions {
  getUserInfo() {
    Api.getUserInfo
      .then((res) => {
        this.dispatch(res.response);
      })
  }

  login(phone,password){
    console.log('loginaction');
    Api.login(phone,password)
      .then((res) => {
        this.dispatch(res.response);
      })
  }
}

module.exports = alt.createActions(UserActions);
