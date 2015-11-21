import {Dimensions, PixelRatio} from 'react-native'
import AppInfo from 'react-native-app-info'
import Device from 'react-native-device'

const screen = Dimensions.get('window')
const DeviceConfig = {
  MagicNumbers:{
    is4s: screen.height <= 480,
    isSmallDevice: screen.width < 360,
    screenWidth: screen.width > 360 ? (screen.width - 40) : (screen.width - 20),
    screenPadding: screen.width > 360 ? 40 : 20,
    size18: screen.width > 360 ? 18 : 16,
    continueButtonHeight: screen.scale == 2 && screen.height <= 480 ? 60 : 80
  }

}

export default DeviceConfig
