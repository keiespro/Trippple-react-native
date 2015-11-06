import {Dimensions, PixelRatio} from 'react-native'
import AppInfo from 'react-native-app-info'
import Device from 'react-native-device'

const screen = Dimensions.get('window')
// console.log(AppInfo,Device)
// const device = 'iphone6Plus'
// window.AppInfo = AppInfo
// console.log(AppInfo.getInfoDeviceName(),AppInfo.getInfoDisplayName(),AppInfo.getInfoName())
const DeviceConfig = {
  MagicNumbers:{
    is4s: screen.height <= 480,
    isSmallDevice: screen.scale < 3,
    screenWidth: screen.scale == 3 ? (screen.width - 40) : (screen.width - 20),
    screenPadding: screen.scale == 3 ? 40 : 20,
    size18: screen.scale == 3 ? 18 : 16,
    continueButtonHeight: screen.scale == 2 && screen.height <= 480 ? 60 : 80
    // HeaderFontSize: Device.scale == 3 ? 20 : 20,
  }

}

console.log(screen)
export default DeviceConfig
