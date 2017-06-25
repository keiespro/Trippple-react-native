import React, { Component } from 'react';
import {
    Animated,
    Easing,
    Image,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FBSDK from 'react-native-fbsdk'
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { DeviceHeight, DeviceWidth, iOS } from '../utils/DeviceConfig';
import ActionMan from '../actions/';
import colors from '../utils/colors';


@withNavigation
class AlbumView extends Component {

    static route = {
        styles: NavigationStyles.FloatHorizontal,
        navigationBar: {
            backgroundColor: colors.shuttleGrayAnimate,
            translucent: false,
            titleStyle: {
                color: colors.white,
                fontFamily: 'montserrat',
                borderBottomWidth: 0,
                fontWeight: '800'
            },
            tintColor: colors.white,
            title(params) {
                return `${params.albumTitle ? params.albumTitle.toUpperCase() : ''}`
            },
            visible: true,
        }
    };

    constructor(props) {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.ds = ds;
        this.state = {
            paging: props.album.photos.paging,
            photo: null,
            photoSource: this.ds.cloneWithRows(props.photos.map(p => p.images[0].source)),
            photos: props.photos,
            selected: null,
            submitting: false,
        }
    }

    componentDidMount() {
        this.doneHeight = new Animated.Value(0);
    }

    selectPhoto(photo, id) {
        Animated.timing(
            this.doneHeight,
            {
                toValue: DeviceHeight / 10,
                duration: 100,
                easing: Easing.linear,
            }
        ).start();
        this.setState({photo: photo, selected: id});
        this.setState({photoSource: this.ds.cloneWithRows(this.props.photos.map(p => p.images[0].source)),})
    }

    submit() {
        this.setState({submitting: true});
        this.props.dispatch(ActionMan.uploadFacebookPic(this.state.photo));
        this.props.dispatch({type: 'SET_DRAWER_OPEN'});
        this.props.navigator.pop(2);
    }

    getMore() {
        if (!this.state.paging.next) return;
        fetch(this.state.paging.next).then(res => res.json()).then(responseData => {
            const photoSource = this.ds.cloneWithRows([...this.state.photos, ...responseData.data].map(p => p.images[0].source));

            this.setState({
                paging: responseData.paging,
                photos: [...this.state.photos, ...responseData.data],
                photoSource,
            });
        })
    }

    renderSinglePhotos(rowData, sectionID, rowID, highlightRow) {
        const { selected, submitting } = this.state;
        const img = rowData;
        const id = rowID;

        return (
            <View style={[styles.photo_list_item, {opacity: selected && selected != id ? 0.6 : 1}]}>
                <TouchableOpacity
                    key={`${id}`}
                    onPress={() => {
                        highlightRow(sectionID, rowID);
                        this.selectPhoto(img, id);
                    }}
                >
                    <Image style={[styles.pic, {borderWidth: selected == id ? 2 : 0}]} source={{ uri: rowData }}/>
                </TouchableOpacity>
                {(selected == id) &&
                    <View style={styles.check_mark}>
                        <Image
                            source={{uri: 'assets/checkMarkWhiteSmall@3x.png'}}
                            style={{width: 20, height: 15, tintColor: colors.outerSpace }}
                            resizeMode={Image.resizeMode.stretch}
                        />
                    </View>
                }
            </View>
        );
    }

    render() {
        const { selected } = this.state;

        return (
            <View style={styles.container}>
                <ListView
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        flexGrow: 1,
                        flexWrap: 'wrap',
                        paddingBottom: 60,
                        paddingTop: 20,
                        width: DeviceWidth,
                    }}
                    dataSource={this.state.photoSource}
                    horizontal={false}
                    initialListSize={24}
                    onEndReached={this.getMore.bind(this)}
                    renderRow={this.renderSinglePhotos.bind(this)}
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: colors.outerSpace,
                        flexGrow: 1,
                    }}
                    vertical
                />
                {selected && 
                    <TouchableOpacity
                        onPress={() => this.submit()}
                        style={[styles.done_button, {height: this.doneHeight}]}
                    >
                        <Text style={styles.done_text}>DONE</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    photo_list_item: {
        alignItems: 'center',
        borderRadius: 6,
        justifyContent: 'center',
        margin: 6,
        overflow: 'hidden',
        padding: 0,
        width: DeviceWidth / 2 - 20,
        height: DeviceWidth / 2 - 20,
    },
    list_album_container: {
        backgroundColor: colors.outerSpace,
        flex: 1,
        marginBottom: 10,
    },
    album_list_row: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        margin: 0,
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 80,
    },
    album_cover_thumbnail: {
        borderRadius: 6,
        marginRight: 20,
        width: 60,
        height: 60,
    },
    pic: {
        borderColor: colors.white,
        borderRadius: 6,
        width: DeviceWidth / 2 - 40,
        height: DeviceWidth / 2 - 40,
    },
    done_button: {
        alignItems: 'center',
        backgroundColor: colors.brightPurple,
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        width: DeviceWidth,
    },
    done_text: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '800',
    },
    check_mark: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 15,
        justifyContent: 'center',
        opacity: 1,
        position: 'absolute',
        right: 0,
        top: 0,
        width: 30,
        height: 30,
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        fbUser: state.fbUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumView);
