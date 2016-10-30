import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  PixelRatio,
  Dimensions,
  Navigator,
  ListView,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  TouchableHighlight,
  NativeModules
} from 'react-native';

import FBSDK from 'react-native-fbsdk'
const {LoginManager, AccessToken, GraphRequest, GraphRequestManager} = FBSDK

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const FB_PHOTO_WIDTH = 200;

import colors from '../utils/colors'
import {connect} from 'react-redux';
import ActionMan from '../actions/';

import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';

@withNavigation
class AlbumView extends React.Component {

  static route = {
    styles: NavigationStyles.FloatHorizontal,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible: true,
      translucent: true,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight: '800'
      },
      tintColor: '#fff',
      title(params) {
        return `${params.albumTitle}`
      }
    }
  };
  constructor(props){
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.ds = ds;
    this.state = {
      submitting: false,
      selected: null,
      photoSource: this.ds.cloneWithRows(props.photos.map(p => p.images[0].source)),
      photos: props.photos,
      paging: props.album.photos.paging
    }
  }
  componentDidMount() {

  }
  selectPhoto(photo, id) {
    //     LayoutAnimation.configureNext()
    // ,{opacity: submitting ? (id == selected ? 1 : 0)  : 1 }
    // TODO: show user some feedback
    this.setState({submitting: true, selected: id})
    this.props.dispatch(ActionMan.uploadFacebookPic(photo))

    setTimeout(() => {

      this.props.navigator.popToTop()
    }, 2000)
  }

  getMore(){
    if(!this.state.paging.next) return;
    fetch(this.state.paging.next).then(res => res.json()).then(responseData => {
      const photoSource = this.ds.cloneWithRows([...this.state.photos, ...responseData.data].map(p => p.images[0].source));

      this.setState({
        paging: responseData.paging,
        photos: [...this.state.photos, ...responseData.data],
        photoSource
      })
    })
  }
  renderSinglePhotos(rowData, sectionID, rowID, highlightRow) {
    // var img = photo.images[0].source//photo.images && photo.images.length > 4 && photo.images[4].source || photo.images && photo.images[0] && photo.images[0].source || photo.source;
        // console.log(rowData,sectionID,rowID)
    const {selected, submitting} = this.state;
    const img = rowData;
    const id = rowID;

    return (
      <TouchableHighlight
        key={`${id}`}
        style={[styles.photo_list_item, {
          transform: [{scale: selected == id ? 2.0 : 1.0 }],
          opacity: selected == id ? 0 : 1
        }]}
        onPress={() => {
          highlightRow(sectionID, rowID)
          this.selectPhoto(img, id)
        }}
      >
        <Image style={[styles.pic]} source={{ uri: rowData }}/>
      </TouchableHighlight>
      );
  }

  render() {
    const album = this.props.album_details;

    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.outerSpace,
        height: DeviceHeight,
        width: DeviceWidth
      }}
      >
        <ListView
          style={{
            paddingTop: 65
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: DeviceWidth
          }}
          dataSource={this.state.photoSource}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets
          vertical
          initialListSize={24}
          onEndReached={this.getMore.bind(this)}
          renderRow={this.renderSinglePhotos.bind(this)}
        />
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
    height: DeviceWidth / 3 - 15,
    overflow: 'hidden',
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
    fbUser: state.fbUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumView);
