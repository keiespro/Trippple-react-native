
import { RemoteConfig } from 'react-native-firebase3';

RemoteConfig.setDefaults({
  'init_actions': 'getLocation,getPotentials'
});

class RC {
  static getValue = async (key) => await RemoteConfig.getString(key)
}

export default RC
