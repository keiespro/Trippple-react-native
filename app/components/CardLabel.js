import React from 'react'
import { Text, View } from 'react-native'
import { pure } from 'recompose'

import styles from './screens/potentials/styles'
import CityState from './CityState'

const CardLabel = pure(({potential, city = '', textColor, matchName, cacheCity, afterNameIcon, cityStateStyle, nameStyle}) => (
  <View
    pointerEvents={'none'}
    style={{
      flexDirection: 'column',
      flexGrow: 1
    }}
  >
    <View
      pointerEvents={'none'}
      style={{
        flexDirection: 'row',
      }}
    >
      <Text
        style={[
          styles.cardBottomText,
          {color: textColor},
          nameStyle || {}
        ]}
        key={`${potential.user.id}-names`}
      >{ matchName }</Text>
      {afterNameIcon ? afterNameIcon : null}
    </View>
    <CityState
      key={'matchName'}
      userId={potential.user.id}
      cityState={potential.user.cityState}
      potential={potential}
      cityStateStyle={cityStateStyle}
      color={textColor}
      cacheCity={cacheCity}
      coords={{lat: potential.user.latitude, lng: potential.user.longitude}}
    />

  </View>
));

export default CardLabel
