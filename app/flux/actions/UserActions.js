import alt from '../alt'
import Api from '../../utils/api'
import phoneParser from 'phone-parser'
import _ from 'underscore'
import base64 from 'base-64'
import Analytics from '../../utils/Analytics';
import AppActions from './AppActions'

function cleanNumber(p){
  return p.replace(/[\. ,():+-]+/g, '').replace(/[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,'');
}

class UserActions {

  initialize(){
    return true
  }
  decouple(){
    return (dispatch) => {
      Api.decouple()
        .then(res => {
          if(!res.saved){
            dispatch({ error: "Please try again" })
          }
          AppActions.clearMatchesData.defer()
          dispatch(res)
        })
        .catch(error => {
          dispatch({ error })
        })
    }
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
  fbLogin(fbAuth,fbUser){
    return (dispatch) => {
      Api.fbLogin(fbAuth,fbUser)
      .then(authResponse => {
        const {api_key,user_id} = authResponse;
        return Api.getUserInfo({api_key, user_id})
                .then(res => {
                  const {user_info} = res.response;
                  return dispatch({
                    userInfo: user_info,
                    userAuth: {
                      api_key,
                      user_id
                    }
                  })
                })

      })
      .catch(err => {
        console.log('ERR',err);
        dispatch(err)
      })
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
    Analytics.event('Interaction',{ type:'tap', name: 'Verify security pin', phone, pin })

    return (dispatch) => {
      Api.verifyPin(pin, phone)
      .then(res => dispatch(res))
      .catch(error => dispatch({error}))
    }
  }

  requestPinLogin(phone) {
    Analytics.event('Interaction', { type:'tap', name: 'Request Security Pin', phone })

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
      Api.uploadImage(image, image_type, data,(err,uploadRes)=>{
        if(err){
          dispatch({
            error: err
          })
        }else{
          this.getUserInfo.defer()
          dispatch(uploadRes)

        }
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
      Analytics.event('Onboarding',{name: 'Select Partner', type: 'Invite', partner_phone: partner.phone, })

      let partnerPhone = partner.phone

      // partner_phone = partner_phone.substr(partner_phone.length - 10, partner_phone.length)
      Api.joinCouple(partnerPhone)
        .then((res) => {
          return Api.joinCouple(partnerPhone)
            .then((ress) => {
              dispatch({
                response: ress,
                showCheckmark:true,
                partnerName: partner.name
              });
            })
        })
        .catch((err) => {
          dispatch({
            err: err
          });
        })
    };
  }

  getCouplePin() {
    return (dispatch) => {
      // Analytics.event('Onboarding',{name: 'Select Partner', type: 'Invite', partner_phone: partner.phone, })
      Api.getCouplePin()
        .then((response) => {
          dispatch({ response });
        })
        .catch((err) => {
          dispatch({ err });
        })
    };
  }

  verifyCouplePin(partner_pin) {
    return (dispatch) => {
      // Analytics.event('Onboarding',{name: 'Select Partner', type: 'Invite', partner_phone: partner.phone, })
      Api.verifyCouplePin(partner_pin)
        .then((response) => {
          dispatch({ response });
        })
        .catch((err) => {
          dispatch({ err });
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
