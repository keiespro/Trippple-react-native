import alt from '../alt'
import Api from '../../utils/api'
import phoneParser from 'phone-parser'
import _ from 'underscore'
import base64 from 'base-64'

function cleanNumber(p){
  return p.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
}

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

  async verifySecurityPin(pin, phone){
    if( pin.length !== 4 ){ return false }
    var res = await Api.verifyPin(pin, phone)
    try{
      this.dispatch(await res.json())
    }
    catch(err){
      console.log('error catched',err);
      this.dispatch(err)
    }
  },

  async requestPinLogin(phone){
    console.log('Request Pin Login Action');
    var res = await Api.requestPin(phone)
    try{
      this.dispatch(await res.json())
    }
    catch(err){
      console.log('error catched',err);
      this.dispatch(err)
    }
  },

  logOut(){
    this.dispatch();
  },

  updateUserStub(updateAttributes){
    this.dispatch(updateAttributes);
  },


  uploadImage(image, image_type){
    Api.uploadImage(image, image_type)
      .then((uploadRes) => {
        this.dispatch(uploadRes.response)
        Api.getUserInfo()
          .then((res) => {
            console.log(res);
            this.dispatch(res.response);
          })
      })
  },

  updateUser(payload){
    var updates = payload;
    //
    // async () => {
    //   try{
    //     var res = await Api.updateUser(payload)
    //     this.dispatch({
    //       response: res,
    //       updates: updates
    //     })
    //   }
    //   catch(err){
    //     console.log('error catched',err);
    //     this.dispatch({
    //       err: err
    //     })
    //   }
    // }
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

    console.log('update action',payload);
  },

  selectPartner(partner){
    const partner_phone = phoneParser(partner.phone,'xxxxxxxxxx');
    Api.joinCouple(partner_phone)
      .then((res) => {
        console.log(res);
        this.dispatch({
          response: res,
          showCheckmark:true,
          partnerName: partner.name
        });
      })
      .catch((err) => {
        console.log(err,'selectPartner err');
        this.dispatch({
          err: err
        });
      })


  },

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
  },

  handleContacts(contacts){
    var allNumbers = _.pluck( _.flatten( _.pluck( contacts, 'phoneNumbers') ), 'number' ).map(cleanNumber)
    Api.sendContactsToBlock( base64.encode( JSON.stringify(allNumbers)))
    this.dispatch();
  }
}

export default alt.createActions(UserActions)
