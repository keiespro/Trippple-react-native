var alt = require('../alt');
var Api = require("../../utils/api");

class UserActions {
  getUserInfo() {
    Api.getUserInfo
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })
  }

  login(phone,password){
    console.log('login action');
    Api.login(phone,password)
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })
  }


  register(phone,password){
    console.log('register action');
    Api.register(phone,password)
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })
  }


  update(payload){
    console.log('update action',payload);
    Api.updateUser(payload)
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })
  }
}

module.exports = alt.createActions(UserActions);
