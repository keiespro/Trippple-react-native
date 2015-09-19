'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;

var UserActions = require('../flux/actions/UserActions');
var FBLogin = require('react-native-facebook-login');
// var FBLoginMock = require('./facebook');
var FBLoginManager = require('NativeModules').FBLoginManager;

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var FB_PHOTO_WIDTH = 200;

var Login = React.createClass({
  getInitialState: function(){
    return {
      user: null,
    };
  },

  renderFBLoginButton: function(){
    var _this = this;

    return (
      <View style={styles.loginContainer}>
        <FBLogin style={{ marginBottom: 10, }}
        permissions={["email","user_friends","user_photos"]}
        onLogin={function(data){
          console.log('[FB] onLogin:',"Logged in!", data);
          _this.setState({ user : data.credentials });
        }}
        onLogout={function(){
          console.log('[FB] onLogout:',"Logged out.");
          _this.setState({ user : null });
        }}
        onLoginFound={function(data){
          console.log('[FB] onLoginFound:',"Existing login found.", data);
          _this.setState({ user : data.credentials });
        }}
        onLoginNotFound={function(){
          console.log('[FB] onLoginNotFound:',"No user logged in.");
          _this.setState({ user : null });
        }}
        onError={function(data){
          console.log('[FB] onError',"ERROR", data);
        }}
        onCancel={function(){
          console.log('[FB] onCancel:',"User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log('[FB] onPermissionsMissing',"Check permissions!", data);
        }}
        />
      </View>
    );
  },

  renderFBLogoutButton: function(){
    var _this = this;

    return (
      <View style={styles.loginContainer}>
      {/*  <FBLoginMock />  */}
      </View>
    );
  },
  render: function() {
    var _this = this;
    var user = this.state.user;

    console.log('[FB] render (user):', user);

    var renderButton = (user ? 'renderFBLogoutButton' : 'renderFBLoginButton');

        // { user && <ProfilePhoto user={user} /> }
        // { user && <ProfileInfo user={user} /> }

    return (
      <View>

        <Text>{ !user ? "Welcome to Trippple" : '' }</Text>
        { _this[renderButton]() }


        { user && <PhotoAlbums user={user} /> }

      </View>
    );
  }
});

var ProfilePhoto = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      photo: null,
    };
  },

  componentWillMount: function(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${user.token}`;

    console.log('FB api > ProfilePhoto',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          photo : {
            url : responseData.data.url,
            height: responseData.data.height,
            width: responseData.data.width,
          },
        });
      })
      .done();
  },

  render: function(){
    var photo = this.state.photo;

    return (
      <View style={styles.bottomBump}>

        <Image
          style={photo &&
            {
              height: photo.height,
              width: photo.width,
            }
          }
          source={{uri: photo && photo.url}}
        />
      </View>
    );
  }
});

var ProfileInfo = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      info: null,
    };
  },

  componentWillMount: function(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}?fields=name,email&access_token=${user.token}`;

    console.log('FB api > ProfileInfo',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          info : {
            name : responseData.name,
            email: responseData.email,
          },
        });
      })
      .done();
  },

  render: function(){
    var info = this.state.info;

    return (
      <View style={styles.bottomBump}>
        <Text>{ info && this.props.user.userId }</Text>
        <Text>{ info && info.name }</Text>
        <Text>{ info && info.email }</Text>
      </View>
    );
  }
});

var PhotoAlbums = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      albums: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      album_photos: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      view_loaded: null,
    };
  },

  componentWillMount: function(){
    this.fetchAlbums();
  },

  fetchAlbums: function() {
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}/albums?redirect=false&access_token=${user.token}`;

    console.log('FB api > PhotoAlbums',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        var albums = responseData.data;
        var total_found = albums.length;
        var count = 0;
        console.log('albums ---',albums);

        if (albums) {
          for (var i in albums) {
            ((x) => {
              var url = 'https://graph.facebook.com/v2.3/' + albums[x].id + '/picture?type=album&redirect=false&access_token=' + user.token;

              fetch(url)
              .then((response) => response.json())
              .then((responseData) => {
                albums[x].cover_photo_image_url = responseData.data.url
                console.log('albums[i]',x, albums[x]);
                return x;
              })
              .done((index) => {
                console.log('done',(+new Date), index);
                count++;

                if (total_found == count) {
                  _this.setState({
                    albums : this.state.albums.cloneWithRows(albums),
                    view_loaded: 'list_albums',
                  });
                }
              });
            })(i);
          }
        }
      })
      .done();
  },

  fetchAlbumPhotos: function(album) {
    var _this = this;
    var user = this.props.user;
    var api = 'https://graph.facebook.com/v2.3/' + album.id + '/photos?redirect=false&access_token=' + user.token;

    console.log('FB api > fetchAlbumPhotos', api);

    if (this.state.album_photos) {
      this.setState({
        album_details: album,
        album_photos : this.state.album_photos.cloneWithRows(photos),
        view_loaded: 'list_album_photos',
      });
    } else {
      // fetch pictures
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
          var photos = responseData.data;
          var total_found = photos.length;
          var count = 0;
          console.log('[album id: ' + album.id + '] photos ---', photos);

          _this.setState({
            album_details: album,
            album_photos : this.state.album_photos.cloneWithRows(photos),
            view_loaded: 'list_album_photos',
          });
        })
        .done();
    }
  },

  selectPhoto: function(photo) {
    console.log('[FB] selectPhoto:', photo);
    UserActions.saveFacebookPicture(photo);
  },

  renderLoadingView: function() {
    return (
      <View style={styles.bottomBump}>
        <Text>
          Loading Albums ...
        </Text>
      </View>
    );
  },

  renderListAlbums: function() {
    var user = this.props.user;
    var albums = this.state.albums;

    console.log('[FB] albums:', albums);

    return (
      <ListView
        contentContainerStyle={styles.list_album_container}
        dataSource={this.state.albums}
        renderRow={this.renderAlbumCover}
      />
    );
  },

  renderAlbumCover: function(album) {
    return (
      <View style={styles.listContainer}>
        <TouchableHighlight onPress={() => { this.fetchAlbumPhotos(album) }}>
          <Image style={styles.album_cover_thumbnail} source={{uri: album.cover_photo_image_url}} />
        </TouchableHighlight>

        <Text>{album.name}</Text>
      </View>
    );
  },

  renderSinglePhotos: function(photo) {
    return (
      <View style={styles.album_list_row}>
        <TouchableHighlight onPress={() => { this.selectPhoto(photo) }}>
          <Image style={styles.single_big_picture} source={{uri: photo.picture}} />
        </TouchableHighlight>
      </View>
    );
  },

  renderAlbumPhotos: function() {
    var album = this.state.album_details;
    console.log('loading album details', album);

    return (
      <View>
        <TouchableHighlight onPress={() => {
          this.setState({
            view_loaded: 'list_albums',
          });
        }}>
          <Text>Back to Albums</Text>
        </TouchableHighlight>

        <Text>Viewing: {album.name}</Text>

        <View>
          <ListView
            dataSource={this.state.album_photos}
            renderRow={this.renderSinglePhotos}
          />
        </View>
      </View>
    );
  },

  render: function(){
    if (this.state.view_loaded == 'list_albums') {
      return this.renderListAlbums();
    } else if (this.state.view_loaded == 'list_album_photos') {
      return this.renderAlbumPhotos();
    } else {
      return this.renderLoadingView();
    }
  }
});

var a = {
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },


  picture: {
    flex: 1,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 100,
    height: 100,
    margin: 10,
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 0,
    width: DeviceWidth / 3 - 20,
    alignItems: 'center',
  },
  image: {
  },
  scrollContent: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: DeviceWidth,
  },
};

var styles = StyleSheet.create({
  list_album_container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 10,
  },
  album_list_row: {
    justifyContent: 'center',
    padding: 5,
    margin: 0,
    width: DeviceWidth / 3 - 20,
    alignItems: 'center',
  },
  album_cover_thumbnail: {
    width: 60,
    height: 60,
  },
  single_big_picture: {
    flex: 1,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 100,
    height: 100,
    margin: 10,
  },
});

module.exports = Login;
