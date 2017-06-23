import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DeviceHeight, DeviceWidth, MagicNumbers } from '../../utils/DeviceConfig';
import colors from '../../utils/colors';


class DoneButton extends Component {

    static defaultProps = {
        ative: false,
        text: 'DONE',
    };
    
    render() {
        return (
            <TouchableOpacity
                disabled={!this.props.active}
                onPress={this.props.onPress}
                style={[styles.container, {
                    backgroundColor: this.props.active ? colors.brightPurple : colors.dark
                }]}
            >
                <Text
                    style={[styles.buttonText, {
                        color: this.props.active ? colors.white : colors.rollingStone
                    }]}
                >
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 3,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 50,
        marginTop: 30,
        marginBottom: 50,
        width: DeviceWidth - 100,
        height: 60,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: '800',
    }
});

export default DoneButton;;