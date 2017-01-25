import React from 'react'
import { Text, View } from 'react-native'
import {pure} from 'recompose'
import styles from './screens/potentials/styles'

import CityState from './CityState'


const CardLabel = pure(({potential, city, textColor, matchName}) => (
  <View pointerEvents={'none'}>
    <Text
      style={[styles.cardBottomText, {color: textColor}]}
      key={`${potential.user.id}-names`}
    >{ matchName }</Text>
    <CityState
      cityState={city.length > 0 ? city : null}
      potential={potential}
      coords={{lat: potential.user.latitude, lng: potential.user.longitude}}
    />
  </View>
));

export default CardLabel
