'use strict';
'use strict';

import React from "react";
import {AppRegistry, StyleSheet, Text, View, ScrollView, Image, CameraRoll, TouchableHighlight, NativeModules} from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    imageGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    }
});

const ImageProject = React.createClass({
    getInitialState() {
        return {
            images: [],
            selected: '',
        };
    },

    componentDidMount() {
        const fetchParams = {
            first: 25,
        };
        CameraRoll.getPhotos(fetchParams)
          .then(this.storeImages)
          .catch(this.logImageError);
    },

    storeImages(data) {
        const assets = data.edges;
        const images = assets.map((asset) => asset.node.image);
        this.setState({
            images: images,
        });
    },

    logImageError(err) {
    },

    selectImage(uri) {
        NativeModules.ReadImageData.readImage(uri, (image) => {
            this.setState({
                selected: image,
            });
        });
    },

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imageGrid}>
                { this.state.images.map((image) => {
                    return (
                        <TouchableHighlight onPress={this.selectImage.bind(null, image.uri)}>
                        <Image style={styles.image} source={{ uri: image.uri }} />
                        </TouchableHighlight>
                    );
                    })
                }
                </View>
            </ScrollView>
        );
    }
});

export default ImageProject
