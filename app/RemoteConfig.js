
import { RemoteConfig } from 'react-native-firebase3';

RemoteConfig.setDefaults({

});

class RC {
  static getValue = async (key) => await RemoteConfig.getString(key)
}

export default RC
