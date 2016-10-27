import AppInfo from 'react-native-app-info'
import { Platform } from 'react-native'
import Promise from 'bluebird'
import config from '../../config'
import DeviceInfo from './DeviceInfo'
import Analytics from './Analytics'

const { SERVER_URL } = config;

const VERSION = '';// AppInfo.getInfoVersion();
const iOSversion = DeviceInfo.version;

async function baseRequest(endpoint = '', payload = {}, resource = 'user'){
  const params = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
    },
    body: JSON.stringify(payload)
  }

  const url = `${SERVER_URL}/${resource}/${endpoint}`;

  if(__DEV__) console.log(`API REQUEST ---->>>>> ${url}`, params);

  const res = await fetch(url, params)

  try{
    if(res.status == 504 || res.status == 502){
      __DEV__ && console.log('show maintenance screen')
      Analytics.err(res)
      throw new Error('Server down')
    }else if(!res.json && res.status == 401){
      Analytics.err(res)
      throw new Error('Unauthorized')
    }

    const response = await res.json()

    if(__DEV__) console.log(`API RESPONSE ${response.status} <<<<<<---- ${endpoint}`, response);

    return Promise.try(() => {
      const r = {...response.response};

      return r
    })
  }catch(err){
    __DEV__ && console.warn(`Error ${res.status} hitting endpoint ${endpoint}`, err);
    // throw ('40 1')
  }
}

function publicRequest(endpoint, payload){
  return baseRequest(endpoint, payload)
}

function authenticatedRequest(endpoint: '', payload: {}, resource, forceCredentials){
  const credentials = forceCredentials || global.creds;
  if(!credentials || !credentials.api_key || !credentials.user_id){
    console.warn('Attempting to make authenticated request with no credentials')
    return false
  }
  const authPayload = {...payload, ...credentials};
  return baseRequest(endpoint, authPayload, resource)
}

const api = {

  requestPin(phone){
    return publicRequest('request_security_pin', { phone })
  },

  verifyPin(pin, phone){
    const payload = { pin, phone, device: DeviceInfo.get(), platform: Platform.OS || 'iOS' }
    return publicRequest('verify_security_pin', payload);
  },

  fbLogin(fbAuth){
    const payload = {
      fb_oauth_code: fbAuth.accessToken,
      fb_user_id: fbAuth.userID,
      device: DeviceInfo.get()
    }
    return publicRequest('fb_login', payload);
  },

  onboard(payload){
    return authenticatedRequest('onboarded', payload)
  },

  updateUser(payload){
    return authenticatedRequest('update', payload)
  },

  getUserInfo(creds){
    return authenticatedRequest('info', {}, 'user', creds)
  },

  getMatches(page){ // v2 endpoint
    return Promise.try(() => {
      authenticatedRequest('getMatches', {page})
    })
  },


  getNewMatches(page){ // v2 endpoint
    return Promise.try(() => authenticatedRequest('getNewMatches', {page}))
  },

  getFavorites(page){ // v2 endpoint
    return authenticatedRequest('getFavourites', {page})
  },

  toggleFavorite(match_id){ // v2 endpoint
    return authenticatedRequest('toggleMatch', {match_id})
  },

  unMatch(match_id){
    return authenticatedRequest('unmatch', {match_id})
  },

  reportUser(to_user_id, to_user_type, reason){
    return authenticatedRequest('report_user', {
      report_id: to_user_id,
      report_object: to_user_type,
      report_action: reason,
      to_user_id, // legacy ?
      to_user_type, // legacy ?
      reason // legacy ?
    })
  },

  getNotificationCount(shouldReset){
    const payload = {};
    if(shouldReset){
      payload.clearall = 1;
    }
    return authenticatedRequest('notification_totals', payload)
  },

  getMessages(payload){
    if(!payload.match_id){ return false }
    return authenticatedRequest('messages', {...payload, message_type: 'retrieve'})
  },

  createMessage(message, matchID){
    const payload = {
      message_type: 'create',
      match_id: matchID,
      message_body: message,
    };
    return authenticatedRequest('messages', payload)
  },

  getPotentials(coordinates){
    return authenticatedRequest('potentials', {...coordinates})
  },

  sendLike(like_user_id, like_status, like_user_type, from_user_type){
  // fix
    return authenticatedRequest('likes', { like_status, like_user_id, like_user_type, from_user_type })
  },

  saveFacebookPicture(photo) {
    return publicRequest('save_facebook_picture', photo);
  },

  uploadFacebookPic(imgUrl){
    return authenticatedRequest('', {photo_url: imgUrl}, 'uploads')
  },

  joinCouple(partner_phone): Promise{
    return authenticatedRequest('join_couple', { partner_phone })
  },

  decouple(): Promise{
    return authenticatedRequest('decouple', {})
  },

  getCouplePin(): Promise{
    return authenticatedRequest('couple_pin', { pin_action: 'request' })
  },

  verifyCouplePin(partner_pin): Promise{
    return authenticatedRequest('couple_pin', { pin_action: 'verify', pin: partner_pin })
  },

  getProfileSettingsOptions(): Promise{
    return publicRequest('get_client_user_profile_options')
  },

  sendContactsToBlock(data): Promise{
    return authenticatedRequest('process_phone_contacts', {data})
  },

  updatePushToken({push_token}): Promise{
    return authenticatedRequest('update', { fcm_token: push_token })
  },

  disableAccount(): Promise{
    return authenticatedRequest('disable')
  },

  async sendTelemetry(encodedTelemetryPayload: String): Promise{
    const authPayload = { ...credentials};
    const params = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-T3P-Api-Version': `2/${VERSION}/${iOSversion}`,
      },
      body: encodedTelemetryPayload
    }

    const res = await fetch(`${SERVER_URL}/telemetry`, params)

    try{
      if(!res.json && res.status == 401){
        throw new Error('NO JSON')
      }
      const response = await res.json()
      __DEV__ && console.log(response)
      return response
    }catch(err){
      __DEV__ && console.error(err)

      return {error: err, status: res.status}
    }
  }


}

export default api
