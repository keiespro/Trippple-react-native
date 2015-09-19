import alt from '../alt'
import Api from '../../utils/api'
import phoneParser from 'phone-parser'

var UserActions = {
  initialize(){
    this.dispatch()
  },

  initSuccess(user_info){
    this.dispatch(user_info);
  },

  initFail(errorMessage){
    console.log(errorMessage)
    this.dispatch(errorMessage);
  },


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

  },

  verifySecurityPin(pin, phone){
    if( pin.length !== 4 ){ return false }

    Api.verifyPin(pin, phone)
      .then((res) => {
        console.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        console.log('error',err);
        this.dispatch(err);
      })
  },

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

  },

  logOut(){
    this.dispatch();
  },

  updateUserStub(updateAttributes){
    this.dispatch(updateAttributes);
  },


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

  },

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
  },

  selectPartner(partner){
    const partner_phone = phoneParser(partner.phoneNumbers[0].number,'xxxxxxxxxx');
    Api.joinCouple(partner)
      .then((res) => {
        console.log(res);
        this.dispatch({
          response: res,
          showCheckmark:true
        });
      })
      .catch((err) => {
        console.log(err);
        this.dispatch({
          err: err
        });
      })


  }

  saveFacebookPicture(photo) {
    Api.saveFacebookPicture(photo)
    .then((res) => {
      console.log('FB photo res', res);
      this.dispatch(res);
    })
    .catch((err) => {
      console.log('FB photo err', err);
      this.dispatch(err);
    })
  }
}

export default alt.createActions(UserActions)
