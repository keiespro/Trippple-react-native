import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native';
import { MagicNumbers } from '../../utils/DeviceConfig';
import colors from '../../utils/colors';
import styles from '../screens/settings/settingsStyles';


const Selectable = ({
    diameter = 30,
    field,
    innerStyle,
    isLast,
    label,
    moreStyle = {},
    onPress,
    outerStyle,
    selected,
}) => (
    <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground(colors.mediumPurple || colors.dark)}
        onPress={onPress}
        style={outerStyle}
    >
        <View
            style={[innerStyle,
                isLast && {borderBottomWidth: 0}
            ]}
        >
            <Text
                style={{
                    color: selected ? colors.white : colors.rollingStone,
                    fontFamily: 'montserrat',
                    fontSize: MagicNumbers.size18,
                }}
            >
                {label}
            </Text>

            {selected ? (
                <Image
                    style={{
                        width: diameter,
                        height: diameter,
                    }}
                    source={require('./assets/ovalSelected@3x.png')}
                />
            ) : (
                <View
                    style={{
                        borderColor: colors.shuttleGray,
                        borderRadius: diameter/2,
                        borderWidth: 1.5,
                        width: diameter,
                        height: diameter,
                    }}
                />
            )}
        </View>
    </TouchableNativeFeedback>
)

Selectable.displayName = 'Selectable';

export default Selectable;
