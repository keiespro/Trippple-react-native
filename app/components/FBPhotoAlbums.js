import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationStyles } from '@exponent/ex-navigation';
import { connect } from 'react-redux';
import _ from 'lodash';
import FBSDK from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { DeviceHeight, DeviceWidth, iOS } from '../utils/DeviceConfig';
import ActionMan from '../actions/';
import colors from '../utils/colors';

const { GraphRequest, GraphRequestManager } = FBSDK;


class PhotoAlbums extends Component {

    static route = {
        styles: iOS ? NavigationStyles.SlideHorizontal : NavigationStyles.FloatVertical,
        navigationBar: {
            backgroundColor: colors.shuttleGrayAnimate,
            renderLeft(route, props) {
                return (
                    <TouchableOpacity style={styles.nav} onPress={() => route.params.navigator.pop()}>
                        <Icon
                            color={colors.white}
                            name="caret-down"
                            size={25}
                        />
                    </TouchableOpacity>
                );
            },
            translucent: false,
            tintColor: colors.white,
            titleStyle: {
                borderBottomWidth: 0,
                color: colors.white,
                fontFamily: 'montserrat',
                fontWeight: '800',
            },
            title: 'FACEBOOK ALBUMS',
            visible: true,
        },
    };

    static propTypes = {
        fbUser: PropTypes.object.isRequired
    };

    constructor(props) {
        super();
        this.aDS = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 != row2
        });
        this.state = {
            albums: [],
            albumSource: null,
            view_loaded: 'list_albums',
        };
    }

    componentDidMount() {
        this.oldFBRequest();
    }

    componentWillReceiveProps(nProps) {
        if ((!this.props.fbUser.accessToken && nProps.fbUser.accessToken) || (this.props.fbUser.permissions.indexOf('user_photos') < 0 && nProps.fbUser.permissions.indexOf('user_photos') >= 0)) {
            this.oldFBRequest();
        }

    }

    getAlbums() {
        const fbUser = this.props.fbUser;
        const _handleAlbums = this._handleAlbums.bind(this);

        if (!fbUser.accessToken) return;
        const { userID,accessToken } = fbUser;
        const infoRequest = new GraphRequest(`${userID}/albums`, {
            parameters: {
                fields: {
                string: 'id,photos{images},name,link,picture{url},count'
                }
            },
            accessToken,
        }, this._handleAlbums.bind(this));
        const FBG = new GraphRequestManager();
        FBG.addRequest(infoRequest).start();
    }

    async oldFBRequest() {
        this.props.dispatch(ActionMan.fetchFacebookAlbums(this.props.fbUser));
    }

    componentWillReceiveProps(nProps) {
        if (nProps.albums) {
            this._handleAlbums(nProps.albums);
        }
    }

    _handleAlbums(responseData) {
        __DEV__ && console.log('_handleAlbums',responseData);
        const albums = _.filter(responseData, al => al.count > 0);
        __DEV__ && console.log(albums);

        this.setState({
            albums: [
                ...this.state.albums,
                ...albums
            ],
            albumSource: this.aDS.cloneWithRows(albums),
            paging: responseData.paging,
            view_loaded: 'list_albums',
        });
    }

    openAlbum(album) {
        this.fetchAlbumPhotos(album);
    }

    fetchAlbumPhotos(album) {
        this.props.navigator.push(this.props.navigation.router.getRoute('FBAlbumView', {
            album,
            album_details: album,
            albumTitle: album.name,
            key: 'fbalbumsz',
            name: 'FB Photos View',
            navigator: this.props.navigator,
            photos: album.photos.data,
            view_loaded: 'list_album_photos',
        }));
    }

    renderLoadingView() {
        return (
            <View style={styles.bottomBump} />
        );
    }

    renderAlbumCover(album) {
        return (
            <View style={{width: DeviceWidth}}>
                <TouchableHighlight
                    onPress={() => this.openAlbum(album)}
                    underlayColor={colors.shuttleGray}
                >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 5}}>
                            <View
                                style={[styles.album_list_row, {
                                    alignItems: 'center',
                                    borderBottomWidth: 1 / PixelRatio.get(),
                                    borderColor: colors.shuttleGray,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    marginLeft: iOS ? 25 : 0,
                                    paddingRight: 25,
                                    height: 80,
                                }]}
                            >
                                <Image
                                    style={styles.album_cover_thumbnail}
                                    source={{ uri: album.picture.data.url }}
                                />
                                <View style={{flexDirection: 'column'}}>
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontFamily: 'montserrat',
                                            fontSize: 16,
                                            fontWeight: '800',
                                        }}
                                    >
                                        {album && album.name ? album.name.toUpperCase() : ''}
                                    </Text>
                                    <Text
                                        style={{
                                            color: colors.shuttleGray,
                                            fontSize: 14,
                                        }}
                                    >
                                        {`${album.count} photos`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                borderBottomWidth: 1 / PixelRatio.get(),
                                borderColor: colors.shuttleGray,
                                flex: 1,
                                justifyContent: 'center',
                                marginRight: 25,
                            }}
                        >
                            <Icon
                                color={colors.rollingStone}
                                name="caret-right"
                                size={25}
                            />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: colors.outerSpace,
                    width: DeviceWidth,
                    height: DeviceHeight,
                }}
            >
                {this.state.albums.length ? (
                    <ListView
                        dataSource={this.state.albumSource}
                        renderRow={this.renderAlbumCover.bind(this)}
                        showsVerticalScrollIndicator={false}
                        style={{
                            flexGrow: 1,
                            marginTop: 0,
                        }}
                    />
                ) :
                    this.renderLoadingView()
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    photo_list_item: {
        alignItems: 'center',
        borderRadius: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: 6,
        padding: 0,
        width: (DeviceWidth / 3) - 15,
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
        marginRight: 20,
        borderRadius: 6,
        width: 60,
        height: 60,
    },
    pic: {
        borderRadius: 6,
        flex: 1,
        width: (DeviceWidth / 3) - 15,
        height: (DeviceWidth / 3) - 15,
    },
    nav: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        width: 40,
        height: 40,
    },
});

const mapStateToProps = (state, ownProps) => ({
    ...ownProps,
    fbUser: state.fbUser,
    user: state.user,
    albums: Object.values(state.facebookAlbums),
})

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbums);
