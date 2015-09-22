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
      fbUser: null,
    };
  },

  renderFBLoginButton: function(){
    var _this = this;

    return (
      <View style={styles.loginContainer}>
        <FBLogin style={{ marginBottom: 10, }}
          {...this.props}

        />
      </View>
    );
  },

  renderFBLogoutButton: function(){

    return (
      <View style={styles.loginContainer}>
      {/*  <FBLoginMock />  */}
      </View>
    );
  },
  render() {
    console.log(this.props)
    var fbUser = this.state.fbUser;

    console.log('[FB] render (fbUser):', fbUser);


        // { fbUser && <ProfilePhoto fbUser={fbUser} /> }
        // { fbUser && <ProfileInfo fbUser={fbUser} /> }

    return (
      <View>

        <Text>{ !fbUser ? "Welcome to Trippple" : '' }</Text>


        { fbUser && <PhotoAlbums {...this.props} fbUser={fbUser} /> }

      </View>
    );
  }
});

var ProfilePhoto = React.createClass({
  propTypes: {
    fbUser: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      photo: null,
    };
  },

  componentDidMount: function(){
    var {fbUser} = this.props;
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${fbUser.token}`;

    console.log('FB api > ProfilePhoto',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
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
    fbUser: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      info: null,
    };
  },

  componentWillMount: function(){
    var _this = this;
    var fbUser = this.props.fbUser;
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=name,email&access_token=${fbUser.token}`;

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
        <Text>{ info && this.props.fbUser.userId }</Text>
        <Text>{ info && info.name }</Text>
        <Text>{ info && info.email }</Text>
      </View>
    );
  }
});

var PhotoAlbums = React.createClass({
  propTypes: {
    fbUser: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    var aDS = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    var pDS = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    return {
      albums: aDS.cloneWithRows([]) ,
      album_photos: pDS.cloneWithRows([]),
      view_loaded: null,
    };
  },

  componentDidMount: function(){
    this.fetchAlbums();
    console.log(this.props)
  },

  fetchAlbums() {
    var fbUser = this.props.fbUser;
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}/albums?redirect=false&access_token=${fbUser.token}`;

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
              var url = 'https://graph.facebook.com/v2.3/' + albums[x].id + '/picture?type=album&redirect=false&access_token=' + fbUser.token;

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
                  this.setState({
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

  fetchAlbumPhotos(album) {
    console.log(album,this.props)
    var fbUser = this.props.fbUser;
    var api = 'https://graph.facebook.com/v2.3/' + album.id + '/photos?redirect=false&access_token=' + fbUser.token;

    console.log('FB api > fetchAlbumPhotos', api);

    if (this.state.album_photos && album.photos) {
      this.setState({
        album_details: album,
        album_photos : this.state.album_photos.cloneWithRows(album.photos),
        view_loaded: 'list_album_photos',
      });
    } else {
      // fetch pictures
      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData)
          var photos = responseData.data;
          var total_found = photos.length;
          var count = 0;
          console.log('[album id: ' + album.id + '] photos ---', photos);

          this.setState({
            album_details: album,
            album_photos : this.state.album_photos.cloneWithRows(photos),
            view_loaded: 'list_album_photos',
          });
        })
        .done();
    }
  },

  selectPhoto(photo) {
    console.log('[FB] selectPhoto:', photo);
    var {navigator,route,imagetype,nextRoute,afterNextRoute} = this.props;
      console.log(this.props,photo)
    if(nextRoute){
      navigator.push({
        component: nextRoute,
        passProps: {
          ...this.props,
          image: {uri:photo.source},
          imagetype: imagetype || '',
          nextRoute: afterNextRoute
        }
      })
      return

    }else{
      var lastindex = this.props.navigator.getCurrentRoutes().length;
      console.log(lastindex);
      var nextRoute = this.props.stack[lastindex];

      nextRoute.passProps = {
        ...this.props,
        image: {uri:photo.source},
        imagetype: imagetype || '',

      }
      navigator.push(nextRoute)

    }

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
    var fbUser = this.props.fbUser;
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
        <TouchableHighlight onPress={(e) => { this.fetchAlbumPhotos(album) }}>
          <Image style={styles.album_cover_thumbnail} source={{uri: album.cover_photo_image_url}} />
        </TouchableHighlight>

        <Text>{album.name}</Text>
      </View>
    );
  },

  renderSinglePhotos: function(photo) {
    return (
      <View style={styles.album_list_row}>
        <TouchableHighlight onPress={(e) => { this.selectPhoto(photo) }}>
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

module.exports = PhotoAlbums;
