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

class UserActions {

  initialize(){
    return true
  }

  getLocation() {
    return (dispatch) => {
      const success = (geo) => {
              this.updateUser.defer(geo.coords);
              dispatch(geo.coords);
            },
            fail = (error) => { dispatch(error) },
            options = {enableHighAccuracy: false, maximumAge: 1000};

      navigator.geolocation.getCurrentPosition(success, fail, options)
    }
  }

  getUserInfo() {
    return (dispatch) => {
      Api.getUserInfo()
      .then((res) => {
        if(res.res.status == 401){
          this.logOut.defer();
        }
        dispatch(res)
      }).catch((err) => {
        dispatch(err)
      })
    }
  }

  verifySecurityPin(pin, phone) {
    if( pin.length !== 4 ){ return false }

    return (dispatch) => {
      Api.verifyPin(pin, phone)
      .then((res) => {
        dispatch(res)
      })
      .catch((err) => {
        dispatch({
          error: err
        })
      })
    }
  }

  requestPinLogin(phone) {
    return (dispatch) => {
      Api.requestPin(phone)
      .then((res) => {
        dispatch(res)
      })
      .catch((err) => {
        dispatch({
          error: err
        })
      })
    }
  }

  logOut(){
    return true
  }

  updateUserStub(updateAttributes){
    return updateAttributes
  }

  uploadImage(image, image_type, data = {}) {
    return (dispatch) => {
      Api.uploadImage(image, image_type, data)
        .then((uploadRes) => {
          this.getUserInfo.defer()
          dispatch(uploadRes)
        })
        .catch((err) => {
          dispatch({
            error: err
          })
        })
    }
  }

  updateUser(payload) {
    const updates = payload;
    return (dispatch) => {
      Api.updateUser(payload)
        .then((res) => {
          dispatch({
            response: res.response,
            updates
          })
        })
        .catch((err) => {
          dispatch({
            error: err
          })
        })
    };
  }

  selectPartner(partner) {
    return (dispatch) => {
      let partner_phone = partner.phone.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
      partnerPhone = partner_phone[0] == '1' ? partner_phone.substr(1,11) : partner_phone

      // partner_phone = partner_phone.substr(partner_phone.length - 10, partner_phone.length)
      Api.joinCouple(partnerPhone)
        .then((res) => {
          dispatch({
            response: res,
            showCheckmark:true,
            partnerName: partner.name
          });
        })
        .catch((err) => {
          dispatch({
            err: err
          });
        })
    };
  }

  saveFacebookPicture(photo) {
    return (dispatch) => {
      Api.saveFacebookPicture(photo)
      .then((res) => {
        dispatch(res);
      })
      .catch((err) => {
        dispatch(err);
      })
    }
  }

  handleContacts(contacts) {
    return (dispatch) => {
      // var allNumbers = _.pluck( _.flatten( _.pluck( contacts, 'phoneNumbers') ), 'number' ).map(cleanNumber)
      // Api.sendContactsToBlock( base64.encode( JSON.stringify(allNumbers)))
      dispatch(contacts);
    }
  }

  updateLocally(payload){
    return payload
  }

  disableAccount(){
    return this.logOut.defer()
  }
}

export default alt.createActions(UserActions)
