'use strict';

import {
  StyleSheet,
  Image,
  Text,
  View,
  PixelRatio,
  Dimensions,
  ListView,
  TouchableHighlight
} from 'react-native';
import React from "react";

import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequest, GraphRequestManager} = FBSDK

import AlbumView from './FBAlbumView'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const FB_PHOTO_WIDTH = 200;

import {NavigationStyles} from '@exponent/ex-navigation';

import colors from '../utils/colors'
import {connect} from 'react-redux';
import ActionMan from '../actions/';

class PhotoAlbums extends React.Component {

  static route = {
    styles: NavigationStyles.FloatHorizontal,

    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params) {
        return `YOUR ALBUMS`
      }
    }
  };

  static propTypes = {
    fbUser: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super()
    this.aDS = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      albumSource: null,
      view_loaded: 'list_albums',
      albums: []
    };
  }

  componentWillMount() {

    if (!this.props.user.facebook_user_id) {
      this.props.dispatch(ActionMan.facebookAuth())

    } else if (!this.props.fbUser.accessToken) {
      this.props.dispatch(ActionMan.facebookAuth())

    } else if (this.props.fbUser.permissions.indexOf('user_photos') < 0) {
      this.props.dispatch(ActionMan.addFacebookPermissions())
    }

  }

  componentDidMount() {
    this.getAlbums();
  }
  componentWillReceiveProps(nProps) {
    if ((!this.props.fbUser.accessToken && nProps.fbUser.accessToken) || (this.props.fbUser.permissions.indexOf('user_photos') < 0 && nProps.fbUser.permissions.indexOf('user_photos') < 0)) {
      this.getAlbums();
    }
  }
  handleAlbums(err, responseData) {

    if (err) {
      console.log('ERR', err);
      return
    }

    const albums = responseData.data
    console.log('handleAlbums', albums);

    this.setState({
      albums: [
        ...this.state.albums,
        ...albums
      ],
      albumSource: this.aDS.cloneWithRows(albums),
      view_loaded: 'list_albums'
    });

  }
  getAlbums() {
    console.log('get albums', this.props);
    const fbUser = this.props.fbUser;
    console.log(fbUser);
    if (!fbUser.accessToken)
      return false;
    const fb_id = fbUser.userID

    const infoRequest = new GraphRequest(`/${fb_id}/albums`, {
      parameters: {
        fields: {
          string: 'id,photos{images},name,link,picture{url},count'
        }
      },
      accessToken: fbUser.accessToken

    }, this.handleAlbums.bind(this),);
    const FBG = new GraphRequestManager();
    const REQ = FBG.addRequest(infoRequest)
    REQ.start();

  }

  openAlbum(album) {
    this.fetchAlbumPhotos(album)
  }
  fetchAlbumPhotos(album) {
    var fbUser = this.props.fbUser;

    this.props.navigator.push(this.props.navigation.router.getRoute('FBAlbumView', {
      name: 'FB Photos View',
      key: 'fbalbumsz',
      dispatch: this.props.dispatch,
      photos: album.photos.data,
      album: album,
      view_loaded: 'list_album_photos',
      album_details: album,
      albumTitle: album.name

    }))

  }

  renderLoadingView() {
    return (
      <View style={styles.bottomBump}>
        <Text>
          Loading Albums ...
        </Text>
      </View>
    );
  }

  renderAlbumCover(album) {
    return (
      <View style={[{
        width: DeviceWidth
      }
      ]}>
        <TouchableHighlight underlayColor={colors.shuttleGray} onPress={() => this.openAlbum(album)}>
          <View style={[
            styles.album_list_row, {
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor: colors.shuttleGray,
              height: 80,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingRight: 25,
              marginLeft: 25
            }
          ]}>
            <Image style={styles.album_cover_thumbnail} source={{
              uri: album.picture.data.url
            }}/>
            <View style={{
              flexDirection: 'column'
            }}>
              <Text style={{
                color: colors.white,
                fontSize: 16,
                fontFamily: 'Montserrat-Bold'
              }}>{album && album.name
                  ? album.name.toUpperCase()
                  : ''}</Text>
              <Text style={{
                color: colors.shuttleGray,
                fontSize: 14
              }}>{`${album.count} photos`}</Text>
            </View>

          </View>

        </TouchableHighlight>

      </View>
    );
  }

  render() {

    var fbUser = this.props.fbUser;
    var albums = this.state.albums;

    return (
      <View style={{
        backgroundColor: colors.outerSpace,
        height: DeviceHeight,
        width: DeviceWidth
      }}>
        {this.state.albums.length
          ? <ListView style={{
            flex: 1,
            marginTop: 0,
            paddingTop: 65
          }} dataSource={this.state.albumSource} renderRow={this.renderAlbumCover.bind(this)} contentInset={{
            left: 0,
            right: 0,
            bottom: 0
          }} automaticallyAdjustContentInsets={true}/>
          : this.renderLoadingView()}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo_list_item: {
    justifyContent: 'center',
    padding: 0,
    flexWrap: 'wrap',
    margin: 6,
    borderRadius: 6,
    width: DeviceWidth / 3 - 15,
    alignItems: 'center'
  },
  list_album_container: {
    flex: 1,

    backgroundColor: colors.outerSpace,
    marginBottom: 10
  },
  album_list_row: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 15,
    margin: 0,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  album_cover_thumbnail: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 6
  },
  pic: {
    flex: 1,
    // flexWrap: 'nowrap',
    width: DeviceWidth / 3 - 15,
    height: DeviceWidth / 3 - 15,
    borderRadius: 6
  }
});

const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    fbUser: state.fbUser,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbums);
