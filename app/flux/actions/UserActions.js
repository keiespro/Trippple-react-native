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

const UserActions = {
  initialize(){
    this.dispatch()
  },

  getLocation(){

     navigator.geolocation.getCurrentPosition(
         (geo) => {
           var {latitude,longitude} = geo.coords;
           this.updateUser.defer(geo.coords);
           this.dispatch(geo.coords);
         },
         (error) => {
           // Open native settings
           this.dispatch()

         },
         {enableHighAccuracy: false, maximumAge: 1000}
       )

  },

  getUserInfo(){
    Api.getUserInfo()
      .then((res) => {
        this.dispatch(res);
      })
      .catch((err) => {
        this.dispatch(err);
      })

  },

  verifySecurityPin(pin, phone){
    console.log('verifySecurityPin',pin, phone)

    if( pin.length !== 4 ){ return false }
    Api.verifyPin(pin, phone)
    .then((res) => {
      console.log('verifyPin ', res)

      this.dispatch( res.json())
    })
    .catch((err) => {
      console.log('verifyPin err', err)

      this.dispatch({error: err})
    })
  },

  requestPinLogin(phone){
    console.log('requestPinLogin')
    Api.requestPin(phone)
    .then((res) => {
      console.log('try',res)

      this.dispatch( res.json())
    })

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
    //     this.dispatch({
    //       err: err
    //     })
    //   }
    // }

    Api.updateUser(payload)
      .then((res) => {
        this.dispatch(res);
      })
      .catch((err) => {
        this.dispatch({error: err});
      })

  },

  selectPartner(partner){
    var partner_phone = partner.phone.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
    var partnerPhone = partner_phone[0] == '1' ? partner_phone.substr(1,11) : partner_phone

    // partner_phone = partner_phone.substr(partner_phone.length - 10, partner_phone.length)
    Api.joinCouple(partnerPhone)
      .then((res) => {
        this.dispatch({
          response: res,
          showCheckmark:true,
          partnerName: partner.name
        });
      })
      .catch((err) => {
        this.dispatch({
          err: err
        });
      })


  },

  saveFacebookPicture(photo) {
    Api.saveFacebookPicture(photo)
    .then((res) => {
      this.dispatch(res);
    })
    .catch((err) => {
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
