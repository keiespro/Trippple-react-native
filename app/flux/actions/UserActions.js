var alt = require('../alt');
var Api = require("../../utils/api");
var Logger = require("../../utils/logger");
var Keychain = require('Keychain');
var server = 'http://api2.trippple.co';


class UserActions {

  getUserInfo() {
    Api.getUserInfo()
      .then((res) => {
        Logger.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        Logger.log('error');
        this.dispatch(err);
      })

  }

  verifySecurityPin(pin, phone){
    Logger.log('verify action');
    Api.verifyPin(pin, phone)
      .then((res) => {
        Logger.log(res);
        console.log('dispatching')
        this.dispatch(res);
      })
      .catch((err) => {
        Logger.log('error');
        this.dispatch(err);
      })
  }

  requestPinLogin(phone){
    Logger.log('Request Pin Login Action');

    Api.requestPin(phone)
      .then((res) => {
        Logger.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        Logger.log('error');
        this.dispatch(err);
      })

  }

  // login(phone,password){
  //   Logger.log('login action');
  //   Api.login(phone,password)
  //     .then((res) => {
  //       Logger.log(res);
  //       this.dispatch(res);
  //     })
  //     .catch((err) => {
  //       Logger.log('error');
  //       this.dispatch();
  //     })
  // }


  // register(phone,password,password2){
  //   Logger.log('register action');
  //   Api.register(phone,password,password2)
  //     .then((res) => {
  //       Logger.log(res);
  //       this.dispatch(res);
  //     })
  //
  // }

  uploadImage(image){
    Api.uploadImage(image)
      .then((res) => {
         Api.getUserInfo()
          .then((res) => {
            Logger.log(res);
            this.dispatch(res);
          })
          .catch((err) => {
            Logger.log(err);
            this.dispatch();
          })

      })
      .catch((err) => {
        Logger.log(err);
        this.dispatch({
          err: err
        });
      })

  }

  updateUser(payload){
    var updates = payload;
    Logger.log('update action',payload);
    Api.updateUser(payload)
      .then((res) => {
        Logger.log(res);
        this.dispatch({
          response: res,
          updates: updates
        });
      })
      .catch((err) => {
        Logger.log(err);
        this.dispatch({
          err: err
        });
      })
  }

  initialize(){
    console.log("INITIALIZE")
    // Keychain.getInternetCredentials(server)
    //   .then((credentials) => {
        // this.dispatch(credentials);
        //
        Api.getUserInfo()
         .then((res) => {
           Logger.log(res);
           this.dispatch(res);
         })
         .catch((err) => {
           Logger.log(err);
           this.dispatch(res);
         })
      //  })



  }
}

module.exports = alt.createActions(UserActions);
