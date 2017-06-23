import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MagicNumbers } from '../../utils/DeviceConfig';
import colors from '../../utils/colors';

class DoneButton extends Component {
    static defaultProps = {
        ative: false,
        text: 'DONE',
    };
    
    render() {
        return (
            <View
                style={[styles.container, {
                    backgroundColor: this.props.active ? colors.brightPurple : colors.dark
                }]}
            >
                <Text>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    }
});

export default DoneButton;;