import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    View,
} from 'react-native';
import colors from '../../../utils/colors';
import { DeviceHeight, DeviceWidth } from '../../../utils/DeviceConfig';


const Loading = () => (
    <View
        style={{
            alignItems: 'center',
            backgroundColor: colors.outerSpace,
            flexGrow: 1,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: DeviceWidth,
            height: DeviceHeight,
        }}
    >
        <ActivityIndicator
            animating
            color={colors.white}
            size="large"
        />
    </View>
)

export default Loading;
