'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Image,
  Text,
  View,
  PixelRatio,
  Navigator,
  ListView,
  ActivityIndicatorIOS,
  TouchableHighlight,
} = React;

var UserActions = require('../flux/actions/UserActions');
var FBLogin = require('react-native-facebook-login');
// var FBLoginMock = require('./facebook');
var FBLoginManager = require('NativeModules').FBLoginManager;

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
import FakeNavBar from '../controls/FakeNavBar'
var FB_PHOTO_WIDTH = 200;


import colors from '../utils/colors'

var ProfilePhoto = React.createClass({
  propTypes: {
    fbUser: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      photo: null,
    };
  },

  componentDidMount(){
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

  render(){
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

  getInitialState(){
    return {
      info: null,
    };
  },

  componentWillMount(){
    var fbUser = this.props.fbUser;
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=name,email&access_token=${fbUser.token}`;

    console.log('FB api > ProfileInfo',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          info : {
            name : responseData.name,
            email: responseData.email,
          },
        });
      })
      .done();
  },

  render(){
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


var AlbumView = React.createClass({


  selectPhoto(photo) {
    console.log('[FB] selectPhoto:', photo);
    var {navigator,route,image_type,nextRoute,afterNextRoute} = this.props;
      console.log(this.props,photo)
    if(nextRoute){
      navigator.push({
        component: nextRoute,
        passProps: {
          ...this.props,
          image: {uri:photo.images && photo.images[0] && photo.images[0].source || photo.source},
          image_type: image_type || '',
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
        image: {uri:photo.images[0].source},
        image_type: image_type || '',

      }
    }

  },
  renderSinglePhotos(photo) {
    console.log(photo)
    var img = photo.images && photo.images.length > 4 && photo.images[4].source || photo.images && photo.images[0] && photo.images[0].source || photo.source;

    return (
      <View style={styles.photo_list_item}>
        <TouchableHighlight onPress={(e) => { this.selectPhoto(photo) }}>
          <Image style={styles.pic} source={{uri: img}} />
        </TouchableHighlight>
      </View>
    );
  },


  render(){

    var album = this.props.album_details;
    console.log('loading album details', album);

    return (
      <View style={{flex:1}}>
        <FakeNavBar
          navigator={this.props.navigator}
          route={this.props.route}
          backgroundStyle={{backgroundColor:'transparent'}}
          onPrev={(n,p)=>(this.props.navigator.pop())}
          blur={true}
          title={album.name.toUpperCase()}
          titleColor={colors.white}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:-4}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
          }
        />
      <View style={{marginTop:50,flex:1,width:DeviceWidth,backgroundColor:colors.outerSpace}}>



          <ListView
            contentContainerStyle={{width:DeviceWidth,height:DeviceHeight,padding:5,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}
            dataSource={this.props.album_photos}
            renderRow={this.renderSinglePhotos}
          />
        </View>
      </View>
    );

  }



})

var PhotoAlbums = React.createClass({
  propTypes: {
    fbUser: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    var aDS = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    var pDS = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    return {
      albums: aDS.cloneWithRows([]) ,
      album_photos: pDS.cloneWithRows([]),
      view_loaded: null,
    };
  },

  componentDidMount(){
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
  openAlbum(album){
    this.fetchAlbumPhotos(album)
  },
  fetchAlbumPhotos(album) {
    console.log(album,this.props)
    var fbUser = this.props.fbUser;
    var api = 'https://graph.facebook.com/v2.3/' + album.id + '/photos?redirect=false&access_token=' + fbUser.token;

    console.log('FB api > fetchAlbumPhotos', api);

    if (this.state.album_photos && album.photos) {
      // this.setState({
      //   album_details: album,
      //   album_photos : this.state.album_photos.cloneWithRows(album.photos),
      //   view_loaded: 'list_album_photos',
      // });

                this.props.navigator.push({
                  component: AlbumView,
                  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                  passProps:{
                    ...this.props,
                    photos: album.photos,
                    album_details: album,
                    album_photos : this.state.album_photos.cloneWithRows(album.photos),
                    // view_loaded: 'list_album_photos',
                  }
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

          this.props.navigator.push({
            component: AlbumView,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            passProps:{
              ...this.props,
              photos: photos,
              album_details: album,
              album_photos : this.state.album_photos.cloneWithRows(photos),
              // view_loaded: 'list_album_photos',
            }
          });
          this.setState({
            album_details: album,
            album_photos : this.state.album_photos.cloneWithRows(photos),
            // view_loaded: 'list_album_photos',
          });
        })
        .done();
    }
  },


  renderLoadingView() {
    return (
      <View style={styles.bottomBump}>
        <Text>
          Loading Albums ...
        </Text>
      </View>
    );
  },


  renderAlbumCover(album) {
    return (
      <View style={[{width:DeviceWidth}]}>
        <TouchableHighlight underlayColor={colors.shuttleGray} onPress={()=>this.openAlbum(album)}>
          <View style={[styles.album_list_row,{borderBottomWidth:1/PixelRatio.get(),borderColor:colors.shuttleGray,height:80,alignItems:'center',justifyContent:'flex-start',flexDirection:'row',paddingRight:25,marginLeft:25}]}>
            <Image style={styles.album_cover_thumbnail} source={{uri: album.cover_photo_image_url}} />
            <View style={{flexDirection:'column'}}>
              <Text style={{color:colors.white,fontSize:16,fontFamily:'Montserrat-Bold'}}>{ album.name.toUpperCase()}</Text>
              <Text style={{color:colors.shuttleGray,fontSize:14}}>{`${album.count} photos`}</Text>
          </View>


          </View>

        </TouchableHighlight>

      </View>
    );
  },


  render(){

    var fbUser = this.props.fbUser;
    var albums = this.state.albums;

    console.log('[FB] albums:', albums);

    return (
      <View style={{flex:1,backgroundColor:colors.outerSpace,height:DeviceHeight,width:DeviceWidth}}>

    {this.state.view_loaded == 'list_albums' ?  <ListView
        contentContainerStyle={styles.list_album_container}
        style={{height:DeviceHeight,flex:1,marginTop:55}}
        dataSource={this.state.albums}
        renderRow={this.renderAlbumCover}
      /> : <ActivityIndicatorIOS style={{alignSelf:'center',alignItems:'center',flex:1,height:200,width:200,justifyContent:'center'}} animating={true} size={'large'}/> }

      <FakeNavBar
        navigator={this.props.navigator}
        route={this.props.route}
        backgroundStyle={{backgroundColor:'transparent'}}
        onPrev={(n,p)=>(this.props.navigator.pop())}
        blur={true}
        title={'ALBUMS'}
        titleColor={colors.white}
        customPrev={
          <View style={{flexDirection: 'row',opacity:0.5,top:-4}}>
            <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>▼ </Text>
          </View>
        }
      />
    </View>
    );
  }
});


var styles = StyleSheet.create({
  photo_list_item:{
    justifyContent: 'center',
    padding: 0,
    flexWrap: 'wrap',
    margin: 6,
    borderRadius:6,
    width: DeviceWidth / 3 - 15,
    alignItems: 'center',
  },
  list_album_container: {
    flex: 1,
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.outerSpace,
    marginBottom: 10,
  },
  album_list_row: {
    flexDirection: 'row',
    height:80,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical:15,
    margin: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  album_cover_thumbnail: {
    width: 60,
    height: 60,
    marginRight:20,
    borderRadius:6
  },
  pic: {
    flex: 1,
    // flexWrap: 'nowrap',
    width: DeviceWidth/3 - 15,
    height: DeviceWidth/3 - 15,
    borderRadius:6,
  },
});

module.exports = PhotoAlbums;
