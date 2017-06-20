import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import colors from '../utils/colors';

class SplashScreen extends Component {
    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Text></Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.outerSpace,
    }
});

export default SplashScreen;
