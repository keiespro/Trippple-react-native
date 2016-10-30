
import React from 'react'
import {TouchableNativeFeedback, View, Text, Image} from 'react-native'
import styles from '../screens/settings/settingsStyles';
import {MagicNumbers} from '../../utils/DeviceConfig'
import colors from '../../utils/colors';


const Selectable = ({selected, onPress, isLast, label, values}) => (
  <TouchableNativeFeedback
    useForeground
    background={TouchableNativeFeedback.SelectableBackground(colors.mediumPurple || colors.dark)}
    onPress={onPress}
  >
    <View style={[styles.insideSelectable, styles.formRow, isLast && {
      borderBottomWidth: 0,
    }]}
    >
      <Text
        style={{color: selected ? colors.white : colors.rollingStone,
              fontSize: MagicNumbers.size18, fontFamily: 'montserrat'
            }}
      >{label}</Text>
      {selected ? <Image
        style={{height: 30, width: 30}}
        source={require('./assets/ovalSelected@3x.png')}
      /> :
        <View
          style={{height: 30, width: 30,
              borderWidth: 1.5,
              borderColor: colors.shuttleGray,
              borderStyle: 'dashed',
              borderRadius: 15
            }}
        />
          }

    </View>
  </TouchableNativeFeedback>
)


export default Selectable
