/*
 * @flow
 */
import React, {Component, PropTypes} from "react";

import {ActivityIndicator, CameraRoll, Image, ListView, ScrollView, StyleSheet, View, Text, NativeModules, TouchableOpacity, Dimensions} from "react-native";

import OnboardingActions from '../flux/actions/OnboardingActions'
import colors from '../utils/colors'
import Analytics from '../utils/Analytics'
import FakeNavBar from './FakeNavBar'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const ScrollViewPropTypes = ScrollView.propTypes;
import EditImageThumb from '../screens/registration/EditImageThumb'
import EditImage from '../screens/registration/EditImage'


const { RNAppInfo, } = NativeModules;
const VERSION = parseFloat(RNAppInfo.shortVersion);

const propTypes = {

  ...ScrollViewPropTypes,
  /**
   * The group where the photos will be fetched from. Possible
   * values are 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream'
   * and SavedPhotos.
   */
  groupTypes: PropTypes.oneOf([
    'Album',
    'All',
    'Event',
    'Faces',
    'Library',
    'PhotoStream',
    'SavedPhotos',
  ]),

  /**
   * Number of images that will be fetched in one page.
   */
  batchSize: PropTypes.number,

  /**
   * A function that takes a single image as a parameter and renders it.
   */
  renderImage: PropTypes.func,

  /**
   * imagesPerRow: Number of images to be shown in each row.
   */
  imagesPerRow: PropTypes.number,

   /**
   * The asset type, one of 'Photos', 'Videos' or 'All'
   */
  assetType: PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),

};


class CameraRollView extends Component{
  static propTypes = propTypes;

  // iOS groupTypes =
  // 'Album',
  //  'All',
  //  'Event',
  //  'Faces',
  //  'Library',
  //  'PhotoStream',
  //  'SavedPhotos',

  static defaultProps = {
    groupTypes: 'All',
    batchSize: 18,
    imagesPerRow: 3,
    assetType: 'Photos'
  };

  constructor(props){
    super()

    this.state = {
      assets: ([]),
      groupTypes: props.groupTypes,
      lastCursor: null,
      assetType: props.assetType,
      noMore: false,
      loadingMore: false,
      loadedImages: {},
      dataSource: new ListView.DataSource({rowHasChanged: this._rowHasChanged.bind(this)}),
    }
  }

  loadAsset(asset){
    var imageFile = asset.node.image;

    if(this.props.getImage){
      this.props.getImage(imageFile)
    }
    if(!this.props.nextRoute){
      this.props.navigator.push({
        component:EditImage,
        passProps: {
          ...this.props,
          image_type: this.props.image_type || '',
          image: imageFile,
          nextRoute: EditImageThumb,
        }
      })

      return

    }else if(this.props.nextRoute){
      this.props.navigator.push({
        component:this.props.nextRoute,
        passProps: {
          ...this.props,
          image_type: this.props.image_type || '',
          image: imageFile,
          nextRoute: EditImageThumb,
          }
        })

        return

    }else{
      var lastindex = this.props.navigator.getCurrentRoutes().length;
      var nextRoute = this.props.stack[lastindex];

      nextRoute.passProps = {
        ...this.props,
        image_type: this.props.image_type || '',
        image: imageFile,
      }
      this.props.navigator.push(nextRoute)
    }
  }

  renderImage(asset,id){
    var imageSize = DeviceWidth / 3 - 20;
    var imageStyle = [styles.image, {width: imageSize, height: imageSize}];
    const location = asset.node.location.longitude ?
      JSON.stringify(asset.node.location) : 'Unknown location';
    return (
      <View style={styles.photo_list_item} key={`${asset.node.image.uri}-tap`}>
        <TouchableOpacity onPress={this.loadAsset.bind( this, asset )}>
          <Image onLoadEnd={this.imageLoad.bind(this,id)}  style={styles.pic} source={{uri: asset.node.image.uri}} />
        </TouchableOpacity>
      </View>
    );
  }
  imageLoad(id){
    this.setState({loadedImages: {...this.state.loadedImages, id: true }})
  }

  /**
   * This should be called when the image renderer is changed to tell the
   * component to re-render its assets.
   */
  rendererChanged(){
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state.dataSource = ds.cloneWithRows(this.state.assets);
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.groupTypes !== nextProps.groupTypes) {
      this.fetch(true);
    }
  }

  _fetch(clear){
    if (clear) {
      const ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged.bind(this)});

      const newState = {
        assets: [],
        groupTypes: this.props.groupTypes,
        lastCursor: null,
        assetType: this.props.assetType,
        noMore: false,
        loadingMore: false,
        dataSource: ds,
      }

      this.setState(newState, this.fetch);
      return;
    }

    var fetchParams = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }


//     if(VERSION < 2.1){
//       CameraRoll.getPhotos(fetchParams).then( data => {

//         const assets = data.edges;
//         const newState = { loadingMore: false };

//         if (!data.page_info.has_next_page) {
//           newState.noMore = true;
//         }

//         if (assets.length > 0) {
//           newState.lastCursor = data.page_info.end_cursor;
//           newState.assets = [...this.state.assets, ...assets];
//           newState.dataSource = this.state.dataSource.cloneWithRows(newState.assets);
//         }

//         this.setState(newState);
//       }

//     }).catch(err => {
//         __DEBUG__ && console.log(err)
//       });
//     }else{
      CameraRoll.getPhotos(fetchParams)
        .then(data => {
          this._appendAssets(data)
        })
        .catch(err => {
          __DEBUG__ && console.log(err)
        })
    // }

  }

  /**
   * Fetches more images from the camera roll. If clear is set to true, it will
   * set the component to its initial state and re-fetch the images.
   */
  fetch(clear){
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true});
     this._fetch(clear);
    }
  }

  render(){
    const isOnboarding = (this.props.navigator.getCurrentRoutes()[0].id != 'potentials');
    var goNext;
    if(isOnboarding){
      goNext = OnboardingActions.proceedToPrevScreen
    }else{
      goNext = this.props.navigator.pop
    }

    return (
      <View style={{flex:1}}>
        <FakeNavBar
          navigator={this.props.navigator}
          route={this.props.route}
          backgroundStyle={{backgroundColor:colors.shuttleGray}}
          onPrev={goNext}
          blur={false}
          title={'YOUR PHOTOS'}
          titleColor={colors.white}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:this.props.navigator.getCurrentRoutes()[0].id == 'potentials' ? 0 : 7}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>▼ </Text>
            </View>
          }
        />
        <View style={{marginTop:54,flex:1,width:DeviceWidth,backgroundColor:colors.outerSpace,height:DeviceHeight-54}}>

          {Object.keys(this.state.loadedImages).length == 0 ?
            <View style={{alignItems:'center',position:'absolute',justifyContent:'center',width:DeviceWidth,height:DeviceHeight-54,flex:10,flexDirection:'column'}}>
              <ActivityIndicator style={{top:0,height:50,width:50,}} color={colors.white20} animating={true} size={'large'}/>
              <Text
                style={{
                  textAlign:'center',fontSize:20,
              color:colors.white20,
              marginTop: 0,
              fontFamily:'Omnes',
            }}>LOADING ALBUMS</Text>


            </View>: <View/>}

        <ListView
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooterSpinner.bind(this)}
          onEndReached={this._onEndReached.bind(this)}
          style={styles.container}
          pageSize={15}
          contentContainerStyle={styles.scrollContent}
          dataSource={this.state.dataSource}
          />
        </View>
      </View>
    )
  }


  _rowHasChanged(r1, r2){
    if (r1.length !== r2.length) {
      return true;
    }

    for (var i = 0; i < r1.length; i++) {
      if (r1[i] !== r2[i]) {
        return true;
      }
    }

    return false;
  }

  _renderFooterSpinner(){
    if(Object.keys(this.state.loadedImages).length == 0){
      return <View/>
    }
    if (this.state && !this.state.noMore) {
      return (
          <View style={{flexDirection:'row',alignSelf:'stretch',alignItems:'center',justifyContent:'center',width:DeviceWidth,height:80}}>
              <ActivityIndicator style={styles.spinner} />
            </View>
          )
    }
    return null;
  }


  _renderRow(rowData, sectionID, rowID){
    // var images = rowData.length ? rowData.map((image) => {
    //   if (image === null) {
    //     return null;
    //   }
    //   return this.renderImage.bind(this,image)
    // }) : [ ];
    return (
      <View style={styles.item} key={`${rowID}-row`}>
        {this.renderImage(rowData,rowID)}
      </View>
    );
  }

  _appendAssets(data){
    var assets = data.edges;
    var newState = { loadingMore: false };

    if (!data.page_info.has_next_page) {
      newState.noMore = true;
    }

    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.assets = [...this.state.assets, ...assets];
      newState.dataSource = this.state.dataSource.cloneWithRows(newState.assets);
    }

    this.setState(newState);
  }

  _onEndReached(){
    if (!this.state.noMore) {
      this.fetch();
    }
  }
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    padding: 5,
    marginHorizontal:6,
    marginVertical: 1,
    width: DeviceWidth / 3 - 15,
    alignItems: 'center',
  },

  image: {
  },
  photo_list_item:{
    justifyContent: 'center',
    padding: 0,
    flexWrap: 'wrap',
    borderRadius:6,
    width: DeviceWidth / 3 - 15,
    alignItems: 'center',
  },
  scrollContent:{
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'center',
    width: DeviceWidth,
    paddingTop:7,
    paddingHorizontal: 4
  },
  pic: {
    flex: 1,
    // flexWrap: 'nowrap',
    width: DeviceWidth/3 - 15,
    height: DeviceWidth/3 - 15,
    backgroundColor:colors.dark,
    borderRadius:6,
  },
  container: {
    flex: 1,
    height:DeviceHeight,
    width: DeviceWidth
  },
})

export default CameraRollView
