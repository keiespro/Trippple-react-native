'use strict';

import React from "react";
import {StyleSheet, Image, Text, View, PixelRatio, Dimensions, Navigator, ListView, ActivityIndicator, TouchableHighlight, NativeModules} from "react-native";

import UserActions from '../flux/actions/UserActions'

import FBSDK from 'react-native-fbsdk'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import FakeNavBar from '../controls/FakeNavBar'
const FB_PHOTO_WIDTH = 200;


import colors from '../utils/colors'
import { connect } from 'react-redux';


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
    console.log(fbUser)


    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {

      })
      .catch((err) => {
        console.log(err);
      })
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
    console.log(fbUser)
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}?fields=name,email&access_token=${fbUser.token}`;


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
      .catch((err) => {

      })
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

  componentDidMount(){
    console.log(this.props);
  },
  selectPhoto(photo) {
    // console.log(photo)
    // var {navigator,route,image_type,nextRoute,afterNextRoute} = this.props;
    // if(nextRoute){
      //
      // navigator.push({
      //   component: nextRoute,
      //   name: 'Edit Image',
      //   key:'editimg',
      //   passProps: {
      //     ...this.props,
      //     image: {uri:photo.images && photo.images[0] && photo.images[0].source || photo.source},
      //     image_type: image_type || '',
      //     nextRoute: afterNextRoute,
      //     isFB:true
      //   }
      // })
      return
    //
    // }else{
    //   // var lastindex = this.props.navigator.getCurrentRoutes().length;
    //   // var nextRoute = this.props.stack[lastindex];
    //
    //   // nextRoute.passProps = {
    //   //   ...this.props,
    //   //   image: {uri:photo.images[0].source},
    //   //   image_type: image_type || '',
    //   //   isFB:true
    //   //
    //   // }
    // }

  },
  renderSinglePhotos(img,id) {
     // var img = photo.images[0].source//photo.images && photo.images.length > 4 && photo.images[4].source || photo.images && photo.images[0] && photo.images[0].source || photo.source;

    console.log(img,id);

    return (
      <View  key={ id+''} style={styles.photo_list_item}>
        <TouchableHighlight onPress={(e) => { this.selectPhoto(img) }}>
          <Image style={styles.pic} source={{uri: img}} />
        </TouchableHighlight>
      </View>
    );
  },


  render(){

    var album = this.props.album_details;
    var isOnboarding = false;// this.props.navigator.getCurrentRoutes()[0].id != 'potentials'
    var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

    const albums = ds.cloneWithRows(this.props.photos.map(p => p.images[0].source))
    return (
      <View style={{flex:1,backgroundColor:colors.outerSpace,height:DeviceHeight,width:DeviceWidth}}>


          <ListView
          style={{marginTop:60,padding:4.5}}
          contentContainerStyle={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}
          dataSource={albums}
           horizontal={false}
           vertical={true}
            renderRow={this.renderSinglePhotos}
          />




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
      albumSource: aDS.cloneWithRows([]) ,
      album_photos: pDS.cloneWithRows([]),
      view_loaded: null,
      albums:[]
    };
  },

  componentDidMount(){
    this.getAlbums();
  },

    handleAlbums(err,responseData){

      if(err){
        console.log('ERR',err);
        return
      }

      const albums = responseData.data
      console.log('handleAlbums',albums);

      this.setState({
        albums: [...this.state.albums, ...albums],
        albumSource: this.state.albumSource.cloneWithRows(albums),
        view_loaded: 'list_albums',

      });

    },
    getAlbums(){
      console.log('get albums',this.props);
      const fbUser = this.props.fbUser;
      console.log(fbUser);

      const fb_id = fbUser.userID

      const infoRequest = new GraphRequest(
        `/${fb_id}/albums`,
        {
          parameters:{
            fields: {
              string:'id,photos{images},name,link,picture{url},count'
            }
          },
          accessToken: fbUser.accessToken

        },
        this.handleAlbums,
      );
      const FBG = new GraphRequestManager();
      const REQ = FBG.addRequest(infoRequest)
      REQ.start();



    },

  openAlbum(album){
    this.fetchAlbumPhotos(album)
  },
  fetchAlbumPhotos(album) {
    var fbUser = this.props.fbUser;

                this.props.navigator.push({
                  component: AlbumView,
                  name: 'FB Photos View',
                  key:'fbalbumsz',
                  // sceneConfig: Navigator.SceneConfigs.PushFromRight,
                  passProps:{
                    photos: album.photos.data,
                    album: album,
                    // album_photos: ds.cloneWithRows(album.photos.data),
                    view_loaded: 'list_album_photos',
                    album_details: album,

                  }
                });

                console.log('pushed');
    // } else {
    //   // fetch pictures
    //   fetch(api)
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //       var photos = responseData.data;
    //       var total_found = photos.length;
    //       var count = 0;
    //
    //       this.props.navigator.push({
    //         component: AlbumView,
    //         sceneConfig: Navigator.SceneConfigs.PushFromRight,
    //         name: 'FB Album View',
    //         key:'fbalbumspics',
    //         passProps:{
    //           ...this.props,
    //           photos: photos,
    //           album_details: album,
    //           album_photos : this.state.album_photos.cloneWithRows(photos),
    //           // view_loaded: 'list_album_photos',
    //         }
    //       });
    //       this.setState({
    //         album_details: album,
    //         album_photos : this.state.album_photos.cloneWithRows(photos),
    //         // view_loaded: 'list_album_photos',
    //       });
    //     })
    //     .catch((err) => {
    //
    //     })
    // }
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
    console.log(album);
    return (
      <View style={[{width:DeviceWidth}]}>
        <TouchableHighlight underlayColor={colors.shuttleGray} onPress={()=>this.openAlbum(album)}>
          <View style={[styles.album_list_row,{borderBottomWidth:1/PixelRatio.get(),borderColor:colors.shuttleGray,height:80,alignItems:'center',justifyContent:'flex-start',flexDirection:'row',paddingRight:25,marginLeft:25}]}>
            <Image style={styles.album_cover_thumbnail} source={{uri: album.picture.data.url}} />
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
    var isOnboarding = false//this.props.navigator.getCurrentRoutes()[0].id != 'potentials'


    return (
      <View style={{flex:1,backgroundColor:colors.outerSpace,height:DeviceHeight,width:DeviceWidth}}>

    {this.state.view_loaded == 'list_albums' ?  <ListView
        style={{flex:1,marginTop:60}}
        dataSource={this.state.albumSource}
        renderRow={this.renderAlbumCover}
      /> : <ActivityIndicator style={{alignSelf:'center',alignItems:'center',flex:1,height:200,width:200,justifyContent:'center'}} animating={true} size={'large'}/> }

      {/* <FakeNavBar
        navigator={this.props.navigator}
        route={this.props.route}
        backgroundStyle={{backgroundColor:'transparent'}}
        onPrev={(n,p)=>(this.props.navigator.pop())}
        blur={true}
        title={'ALBUMS'}
        titleColor={colors.white}
        customPrev={
          <View style={{flexDirection: 'row',opacity:0.5,top:isOnboarding ? 7  : -4}}>
            <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>▼ </Text>
          </View>
        }
      /> */}
    </View>
    );
  }
});


const styles = StyleSheet.create({
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



const mapStateToProps = (state, ownProps) => {
  // console.log('state',state,'ownProps',ownProps); // state
  return { fbUser: state.fbUser }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbums);
