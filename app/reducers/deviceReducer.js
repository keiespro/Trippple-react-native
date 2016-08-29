import DeviceInfo from '../utils/DeviceInfo'
const Device = DeviceInfo.get()

export default function deviceReducer(state = initialState, action) {

  switch (action.type) {

  case 'UPDATE_USER_FULFILLED':
    console.log(action.meta[0]['push_token']);

    return {...state, push_token: action.meta[0]['push_token']}

  case 'LOG_OUT':
  case 'LOG_OUT_FULFILLED':

    return initialState;

  default:

    return state;
  }
}


const initialState = {
  push_token: null,

  uuid: Device.uuid,
  version: Device.version,
  platform: Device.platform,
  name: Device.name,
  locale: Device.locale,
  country: Device.country,
  model: Device.model,
  manufacturer: Device.manufacturer,
};
