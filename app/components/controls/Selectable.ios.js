import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import styles from '../screens/settings/settingsStyles';
import { MagicNumbers } from '../../utils/DeviceConfig';
import colors from '../../utils/colors';


const Selectable = ({
    field,
    innerStyle,
    isLast,
    label,
    onPress,
    outerStyle,
    selected,
    underlayColor,
}) => (
    <TouchableHighlight
        underlayColor={underlayColor || colors.dark}
        onPress={() => onPress(field)}
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
                        width: 30,
                        height: 30,
                    }}
                    source={require('./assets/ovalSelected@3x.png')}
                />
            ) : (
                <View
                    style={{
                        borderColor: colors.shuttleGray,
                        borderRadius: 15,
                        borderWidth: 2,
                        width: 30,
                        height: 30,
                    }}
                />
            )}
        </View>
    </TouchableHighlight>
)

Selectable.displayName = 'Selectable';

export default Selectable;
