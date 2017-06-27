import React, { Component } from "react";
import {
    Dimensions,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import colors from '../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class LockFailed extends Component{

    render() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                    padding: 20,
                    width: DeviceWidth,
                    height: DeviceHeight,
                }}
            >
                <Text
                    style={{
                        color: colors.white,
                        fontSize: 20,
                        textAlign: 'center',
                    }}
                >
                    Please authenticate with TouchID to access Trippple.
                </Text>
                <TouchableHighlight
                    onPress={this.props.retry}
                    style={{
                        borderRadius: 8,
                        backgroundColor: colors.sushi,
                        marginTop: 50,
                        padding: 20,
                        width: DeviceWidth - 50,
                    }}
                    underlayColor={colors.mediumPurple}
                >
                    <Text
                        style={{
                            color: colors.white,
                            fontSize: 24,
                            textAlign: 'center',
                        }}
                    >
                        Retry
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

export default LockFailed;
