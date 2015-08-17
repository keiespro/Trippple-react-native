import alt from '../alt';
import Api from '../../utils/api';
import Keychain from 'Keychain';
const server = 'http://api2.trippple.co';


class UserActions {

  getUserInfo(){
    Api.getUserInfo()
      .then((res) => {
        console.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        console.log('error');
        this.dispatch(err);
      })

  }

  verifySecurityPin(pin, phone){
    console.log('verify action');
    Api.verifyPin(pin, phone)
      .then((res) => {
        console.log(res);
        console.log('dispatching')
        this.dispatch(res);
      })
      .catch((err) => {
        console.log('error');
        this.dispatch(err);
      })
  }

  requestPinLogin(phone){
    console.log('Request Pin Login Action');

    Api.requestPin(phone)
      .then((res) => {
        console.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        console.log('error');
        this.dispatch(err);
      })

  }

  logOut(){
    Keychain.resetInternetCredentials(server)
      .then((credentials) => {
        this.dispatch();
      })


  }

  updateUserStub(updateAttributes){
    this.dispatch(updateAttributes);
  }

  // login(phone,password){
  //   console.log('login action');
  //   Api.login(phone,password)
  //     .then((res) => {
  //       console.log(res);
  //       this.dispatch(res);
  //     })
  //     .catch((err) => {
  //       console.log('error');
  //       this.dispatch();
  //     })
  // }


  // register(phone,password,password2){
  //   console.log('register action');
  //   Api.register(phone,password,password2)
  //     .then((res) => {
  //       console.log(res);
  //       this.dispatch(res);
  //     })
  //
  // }

  uploadImage(image){
    Api.uploadImage(image)
      .then((uploadRes) => {
         Api.getUserInfo()
          .then((res) => {
            console.log(res);
            this.dispatch(res);
          })
          .catch((err) => {
            console.log(err);
            this.dispatch({
              err: err
            });
          })

      })
      .catch((err) => {
        console.log(err);
        this.dispatch({
          err: err
        });
      })

  }

  updateUser(payload){
    var updates = payload;
    console.log('update action',payload);
    Api.updateUser(payload)
      .then((res) => {
        console.log(res);
        this.dispatch({
          response: res,
          updates: updates
        });
      })
      .catch((err) => {
        console.log(err);
        this.dispatch({
          err: err
        });
      })
  }

  initialize(){
    console.log('INITIALIZE');
    // Keychain.getInternetCredentials(server)
    //   .then((credentials) => {
        // this.dispatch(credentials);
        //
        Api.getUserInfo()
         .then((res) => {
           console.log(res);
           this.dispatch(res);
         })
         .catch((err) => {
           console.log(err);
           this.dispatch(err);
         })
      //  })



  }
}

export default alt.createActions(UserActions)
