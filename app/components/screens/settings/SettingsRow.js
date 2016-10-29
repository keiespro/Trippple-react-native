import React from 'react';
import { Text, View, TouchableHighlight, Image, TouchableNativeFeedback, Platform, StyleSheet } from 'react-native';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'


const SettingsRow = ({title, subtitle, pushScreen}) => (
    <TouchableNativeFeedback
      onPress={pushScreen}
      useForeground
      background={TouchableNativeFeedback.Ripple(colors.rollingStone)}
    >
      <View style={styles.wrapfield}>
        <View>
          <Text
            style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', fontWeight: '800'}}
          >{title}</Text>
          <Text
            style={{color: colors.rollingStone, fontSize: 16, fontFamily: 'omnes'}}
          >{subtitle}</Text>
        </View>
        <Image source={require('./assets/nextArrow@3x.png')} resizeMode={'contain'} style={styles.arrowStyle} />
      </View>
    </TouchableNativeFeedback>
  )
  //
  // Platform.select({
  //  ios: ({title, subtitle, pushScreen}) => (
  //    <TouchableHighlight
  //      onPress={pushScreen}
  //      underlayColor={colors.dark}
  //    >
  //      <View style={styles.wrapfield}>
  //        <View>
  //          <Text
  //            style={{color: colors.white, fontSize: 18, fontFamily: 'montserrat', fontWeight: '800'}}
  //          >{title}</Text>
  //          <Text
  //            style={{color: colors.rollingStone, fontSize: 16, fontFamily: 'omnes'}}
  //          >{subtitle}</Text>
  //        </View>
  //        <Image source={require('./assets/nextArrow@3x.png')} resizeMode={'contain'} style={styles.arrowStyle} />
  //      </View>
  //    </TouchableHighlight>
  //  ),
  //  android:
  // })

export default SettingsRow

const styles = StyleSheet.create({
  arrowStyle: {
    tintColor: colors.shuttleGray,
    opacity: 0.4,
    width: 12,
    height: 12
  },
  wrapfield: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.shuttleGray,
    height: 80,
  //  backgroundColor:colors.outerSpace,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: MagicNumbers.screenPadding / 2,
    marginLeft: MagicNumbers.screenPadding / 1.5
  },

})
