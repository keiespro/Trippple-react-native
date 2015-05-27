var alt = require('../alt');
var Api = require("../../utils/api");

class UserActions {
  getUserInfo() {
    Api.getUserInfo
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })
      .catch((err) => {
        console.log(err);
        this.dispatch();
      })
  }

  verifySecurityPin(pin, phone){
    console.log('verify action');
    Api.verifyPin(pin, phone)
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
      .catch((err) => {
        console.log('error');
        this.dispatch();
      })
  }


  register(phone,password,password2){
    console.log('register action');
    Api.register(phone,password,password2)
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })

  }

  uploadImage(image){
    Api.uploadImage(image)
      .then((res) => {
        console.log(res);
        this.dispatch(res.response);
      })

  }

  updateUser(payload){
    const updates = payload;
    console.log('update action',payload);
    Api.updateUser(payload)
      .then((res) => {
        console.log(res);
        this.dispatch({
          response: res.response,
          updates: updates
        });
      })
      .catch((err) => {
        console.log(err);
        this.dispatch({
          response: err,
          updates: payload
        });
      })
  }
}

module.exports = alt.createActions(UserActions);
