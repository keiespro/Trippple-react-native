import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions
} from 'react-native';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors';

const UserImageCircle = ({id, thumbUrl, onPress,overrideStyles = {}}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{marginTop: 0, }}
  >
    <View>
      <Image
        style={[styles.userimage, overrideStyles]}
        key={`${id}thumb`}
        defaultSource={require('./screens/settings/assets/placeholderUser@3x.png')}
        resizeMode={Image.resizeMode.cover}
        source={thumbUrl ? {uri: thumbUrl} : require('./screens/settings/assets/placeholderUser@3x.png')}
      />
      <View style={styles.circle}>
        <Image
          style={{width: 18, height: 18}}
          source={require('./screens/settings/assets/cog@3x.png')}
          resizeMode={Image.resizeMode.contain}
        />
      </View>
    </View>
  </TouchableOpacity>
)

export default UserImageCircle

const styles = StyleSheet.create({


  userimage: {
    padding: 0,
    width: DeviceWidth / 2 - 20,
    height: DeviceWidth / 2 - 20,
    alignItems: 'center',
    borderRadius: ((DeviceWidth / 2 - 20) / 2),
    overflow: 'hidden'
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.mediumPurple,
    position: 'absolute',
    top: 8,
    left: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }

})
