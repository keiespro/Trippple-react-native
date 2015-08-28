import alt from '../alt';
import Api from '../../utils/api';
import Keychain from 'react-native-keychain';

const KEYCHAIN_NAMESPACE = window.keychainUrl || global.keychainUrl



class UserActions {

  getUserInfo(){
    Api.getUserInfo()
      .then((res) => {
        console.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        console.log('error',err);
        this.dispatch(err);
      })

  }

  verifySecurityPin(pin, phone){
    console.log('verify action');
    Api.verifyPin(pin, phone)
      .then((res) => {
        console.log(res);
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
    Keychain.resetInternetCredentials(KEYCHAIN_NAMESPACE)
      .then(() => {
        this.dispatch();
      })
      .catch((err) => {
        console.log('error',err);
        this.dispatch(err);
      })



  }

  updateUserStub(updateAttributes){
    console.log(updateAttributes)
    this.dispatch(updateAttributes);
  }


  uploadImage(image, imagetype){
    Api.uploadImage(image,imagetype)
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





  }
}

export default alt.createActions(UserActions)
