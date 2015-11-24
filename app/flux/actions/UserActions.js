import alt from '../alt'
import Api from '../../utils/api'
import phoneParser from 'phone-parser'
import _ from 'underscore'
import base64 from 'base-64'
import Mixpanel from '../../utils/mixpanel';
import AppActions from './AppActions'

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
    this.getUserInfo()
  },


  getUserInfo(){
    Api.getUserInfo()
      .then((res) => {
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
      this.dispatch({error: err})
    }
  },

  async requestPinLogin(phone){
    var res = await Api.requestPin(phone)
    try{
      this.dispatch(await res.json())
    }
    catch(err){
      this.dispatch(err)
    }
  },

  logOut(){
    this.dispatch();
  },

  updateUserStub(updateAttributes){
    this.dispatch(updateAttributes);
  },


  uploadImage(image, image_type, data = {}){
    Api.uploadImage(image, image_type, data)
      .then((uploadRes) => {
        this.getUserInfo.defer()
        this.dispatch(uploadRes)
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
    console.log('update action',payload);

    Api.updateUser(payload)
      .then((res) => {
        console.log(res);
        this.dispatch(res);
      })
      .catch((err) => {
        console.log(err);
        this.dispatch({error: err});
      })

  },

  selectPartner(partner){
    var partnerPhone = partner.phone[0] == '1' ? partner.phone.substr(1,11) : partner.phone
    console.log('partnerPhone',partnerPhone);
    const partner_phone = phoneParser(partnerPhone,'xxxxxxxxxx');
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
    AppActions.grantPermission('contacts');
    var allNumbers = _.pluck( _.flatten( _.pluck( contacts, 'phoneNumbers') ), 'number' ).map(cleanNumber)
    Api.sendContactsToBlock( base64.encode( JSON.stringify(allNumbers)))
    this.dispatch();
  },


  updateLocally(payload){
    this.dispatch(payload)
  }
}

export default alt.createActions(UserActions)
