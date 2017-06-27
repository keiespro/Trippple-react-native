import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import colors from '../../utils/colors';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

const BlurModal = ({children, showMap}) => (
    <View
        style={{flexGrow: 1}}
    >
        <View
            style={{
                backgroundColor: colors.outerSpace,
                flexGrow: 1,
            }}
        >
            {(showMap) && (
                <Image 
                    style={localstyles.backgroundStyle}
                    source={require('./assets/locationMap@3x.png')}
                />
            )}
        </View>
        <ScrollView
            contentContainerStyle={localstyles.modalscrollcontainer}
            showsVerticalScrollIndicator={false}
            style={localstyles.modalscroll}
        >
            {children}
        </ScrollView>
    </View>
)

const localstyles = StyleSheet.create({
    backgroundStyle: {
        resizeMode: 'stretch',
        top: 0,
        width: DeviceWidth,
        height: 0.6 * DeviceHeight,
    },
    modalscroll: {
        backgroundColor: 'transparent',
        flexGrow: 1,
        position: 'absolute',
        width: DeviceWidth,
        height:DeviceHeight,
    },
    modalscrollcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexGrow: 1,
        width: DeviceWidth,
        height: DeviceHeight,
    }
})

export default BlurModal;
