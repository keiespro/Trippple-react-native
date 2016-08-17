import DeviceInfo from '../utils/DeviceInfo'

export default function deviceReducer(state = initialState, action) {

  switch (action.type) {

    case 'LOG_OUT':

      return initialState;

    default:

      return state;
  }
}


const initialState = {
  push_token: null,
  
  uuid: DeviceInfo.uuid,
  version: DeviceInfo.version,
  platform: DeviceInfo.platform,
  name: DeviceInfo.name,
  locale: DeviceInfo.locale,
  country: DeviceInfo.country,
  model: DeviceInfo.model,
  manufacturer: DeviceInfo.manufacturer,
};
