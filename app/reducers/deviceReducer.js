import DeviceInfo from '../utils/DeviceInfo'
const Device = DeviceInfo.get()

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

  uuid: Device.uuid,
  version: Device.version,
  platform: Device.platform,
  name: Device.name,
  locale: Device.locale,
  country: Device.country,
  model: Device.model,
  manufacturer: Device.manufacturer,
};
