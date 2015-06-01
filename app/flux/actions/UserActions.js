var alt = require('../alt');
var Api = require("../../utils/api");
var Logger = require("../../utils/logger");

class UserActions {

  getUserInfo() {
    Api.getUserInfo
      .then((res) => {
        Logger.log(res);
        this.dispatch(res.response);
      })
      .catch((err) => {
        this.dispatch();
      })
  }

  verifySecurityPin(pin, phone){
    Logger.log('verify action');
    Api.verifyPin(pin, phone)
      .then((res) => {
        Logger.log(res);
        this.dispatch(res.response);
      })

  }

  login(phone,password){
    Logger.log('login action');
    Api.login(phone,password)
      .then((res) => {
        Logger.log(res);
        this.dispatch(res.response);
      })
      .catch((err) => {
        Logger.log('error');
        this.dispatch();
      })
  }


  register(phone,password,password2){
    Logger.log('register action');

    Api.register(phone,password,password2)

      .then( (res) => {
        this.dispatch(res.response);
      })

      .catch( (err) => {
        this.dispatch({error: err});
      });
  }

  uploadImage(image){
    Api.uploadImage(image)
      .then((res) => {
        Logger.log(res);
        this.dispatch(res.response);
      })

  }

  updateUser(payload){
    const updates = payload;
    Logger.log('update action',payload);
    Api.updateUser(payload)
      .then((res) => {
        Logger.log(res);
        this.dispatch({
          response: res.response,
          updates: updates
        });
      })
      .catch((err) => {
        Logger.log(err);
        this.dispatch({
          response: err,
          updates: payload
        });
      })
  }
}

module.exports = alt.createActions(UserActions);
