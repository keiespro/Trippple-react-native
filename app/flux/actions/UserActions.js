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
      navigator.geolocation.getCurrentPosition(
          (geo) => {
            var {latitude,longitude} = geo.coords;
            this.updateUser.defer(geo.coords);
            dispatch(geo.coords);
          },
          (error) => {
            // Open native settings ??
            dispatch(error)
          },
          {enableHighAccuracy: false, maximumAge: 1000}
        )
    }
  }

  getUserInfo() {
    console.warn('get user info 1');

    return (dispatch) => {
      console.warn('get user info 2');
      Api.getUserInfo()
        .then((res) => {
          console.warn('res',res)
          return res
        }).then((res) => {
            console.warn('res2',res)
              return dispatch(res)

        }).done()


    }
  }

  verifySecurityPin(pin, phone) {
    if( pin.length !== 4 ){ return false }

    return (dispatch) => {
      Api.verifyPin(pin, phone)
      .then((res) => {
        res.json().then((response) => dispatch(response))
      })
      .catch((err) => {
        dispatch({error: err})
      })
    }
  }

  requestPinLogin(phone) {
    return (dispatch) => {
      Api.requestPin(phone)
      .then((res) => {
        dispatch(res.json())
      })
      .catch((err) => {
        dispatch({error: err})
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
          dispatch({error: err})
        })
    }
  }

  updateUser(payload) {
    return (dispatch) => {
      const updates = payload;
      //
      // async () => {
      //   try{
      //     var res = await Api.updateUser(payload)
          // this.dispatch({
          //   response: res,
          //   updates: updates
          // })
      //   }
      //   catch(err){
      //     this.dispatch({
      //       err: err
      //     })
      //   }
      // }

      Api.updateUser(payload)
        .then((res) => {
          dispatch({
            response: res.response,
            updates
          })
        })
        .catch((err) => {
          dispatch({error: err})
        })
    };
  }

  selectPartner(partner) {
    return (dispatch) => {
      var partner_phone = partner.phone.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
      var partnerPhone = partner_phone[0] == '1' ? partner_phone.substr(1,11) : partner_phone

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
      AppActions.grantPermission.defer('contacts');
      var allNumbers = _.pluck( _.flatten( _.pluck( contacts, 'phoneNumbers') ), 'number' ).map(cleanNumber)
      Api.sendContactsToBlock( base64.encode( JSON.stringify(allNumbers)))
      dispatch();
    }
  }

  updateLocally(payload){
    return payload
  }

  disableAccount(){
    return (dispatch) => {
      Api.disableAccount()
      .then(()=>{
        this.logOut.defer();
      })
      .catch((err) => {
        dispatch({error: err})
      })
    }
  }
}

export default alt.createActions(UserActions)
