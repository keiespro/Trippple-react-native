import React, { Component } from 'react';
import {
    Image,
    LayoutAnimation,
    ListView,
    StyleSheet,
    Text,
    TouchableHighlight,
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
            photoSource: this.ds.cloneWithRows(props.photos.map(p => p.images[0].source)),
            photos: props.photos,
            selected: null,
            submitting: false,
        }
    }

    componentDidMount() {
        this.doneAnimation = {
            duration: 200,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            }
        }
    }

    selectPhoto(photo, id) {
        this.setState({selected: id});
        console.log(this.doneAnimation)
        LayoutAnimation.configureNext(this.doneAnimation);
    }

    submit() {
        // this.setState({submitting: true, selected: id});
        // this.props.dispatch(ActionMan.uploadFacebookPic(photo));
        // this.props.dispatch({type:'SET_DRAWER_OPEN'});
        // this.props.navigator.pop(2);
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
            <TouchableHighlight
                delayPressIn={200}
                key={`${id}`}
                onPress={() => {
                    highlightRow(sectionID, rowID);
                    this.selectPhoto(img, id);
                }}
                style={[styles.photo_list_item, {
                    opacity: selected == id ? 0 : 1,
                    transform: [{scale: selected == id ? 2.0 : 1.0 }],
                }]}
            >
                <Image style={styles.pic} source={{ uri: rowData }}/>
            </TouchableHighlight>
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
                        style={styles.done_button}
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
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: 6,
        overflow: 'hidden',
        padding: 0,
        width: DeviceWidth / 3 - 15,
        height: DeviceWidth / 3 - 15,
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
        borderRadius: 6,
        flex: 1,
        width: DeviceWidth / 3 - 15,
        height: DeviceWidth / 3 - 15,
    },
    done_button: {
        alignItems: 'center',
        backgroundColor: colors.brightPurple,
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        width: DeviceWidth,
        height: DeviceHeight / 10,
    },
    done_text: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '800',
    }
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
