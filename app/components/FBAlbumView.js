'use strict';

import React from "react";
import {StyleSheet, Image, Text, View, PixelRatio, Dimensions, Navigator, ListView,ScrollView, ActivityIndicator, TouchableHighlight, NativeModules} from "react-native";


import FBSDK from 'react-native-fbsdk'
const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const FB_PHOTO_WIDTH = 200;


import colors from '../utils/colors'
import { connect } from 'react-redux';
import ActionMan from  '../actions/';



import {
  NavigationStyles,
} from '@exponent/ex-navigation';

class AlbumView extends React.Component{

  static route = {
    styles: NavigationStyles.FloatVertical,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return `${params.albumTitle}`
      }
    }
  };
  componentDidMount(){
    console.log(this.props);
  }
  selectPhoto(photo) {
    console.log(photo)

    this.props.dispatch(ActionMan.uploadFacebookPic(photo.img))


  }
  renderSinglePhotos(img,id) {
     // var img = photo.images[0].source//photo.images && photo.images.length > 4 && photo.images[4].source || photo.images && photo.images[0] && photo.images[0].source || photo.source;

    console.log(img,id);

    return (
      <View  key={ id+''} style={styles.photo_list_item}>
        <TouchableHighlight onPress={ this.selectPhoto.bind(this,{img,id}) }>
          <Image style={styles.pic} source={{uri: img}} />
        </TouchableHighlight>
      </View>
    );
  }


  render(){

    var album = this.props.album_details;

    var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

    const albums = ds.cloneWithRows(this.props.photos.map(p => p.images[0].source))
    return (
      <View style={{flex:1,backgroundColor:colors.outerSpace,height:DeviceHeight,width:DeviceWidth}}>


          <ListView
          style={{paddingTop: 60}}
          contentContainerStyle={{flexDirection:'row',justifyContent:'center',alignItems:'center',flexWrap:'wrap',width:DeviceWidth}}
          dataSource={albums}
           horizontal={false}
           contentInset={{top:60,left:0,right:0,bottom:0}}
           automaticallyAdjustContentInsets={true}
           vertical={true}
            renderRow={this.renderSinglePhotos.bind(this)}
          />




        </View>
     );

  }



}




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
  return { ...ownProps,fbUser: state.fbUser }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumView);
