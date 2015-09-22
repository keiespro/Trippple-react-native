/*
 * @flow
 */
import React from 'react-native'

import {
  PropTypes,
  Component,
  ActivityIndicatorIOS,
  CameraRoll,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import scrollable from 'react-native-scrollable-decorator';

import colors from '../utils/colors'
import FakeNavBar from './FakeNavBar'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const ScrollViewPropTypes = ScrollView.propTypes;
import EditImageThumb from '../screens/registration/EditImageThumb'

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

}

@scrollable
class CameraRollView extends Component{
  static propTypes = propTypes

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
    batchSize: 30,
    imagesPerRow: 3,
    assetType: 'Photos'
  }

  constructor(props){
    super()

    this.state = {
      assets: ([]),
      groupTypes: props.groupTypes,
      lastCursor: (null : ?string),
      assetType: props.assetType,
      noMore: false,
      loadingMore: false,
      dataSource: new ListView.DataSource({rowHasChanged: this._rowHasChanged.bind(this)}),
    }
  }

  loadAsset = (asset) => {
    const imageFile = asset.node.image;

    if(this.props.getImage){
      this.props.getImage(imageFile)
    }
    if(this.props.nextRoute){
      this.props.navigator.push({
        component:this.props.nextRoute,
        passProps: {
          imagetype: this.props.imagetype || '',
          image: imageFile,
          nextRoute: EditImageThumb
        }
      })

      return
    }

   var lastindex = this.props.navigator.getCurrentRoutes().length;
  console.log(lastindex,this.props.navigator.getCurrentRoutes(),this.props.stack[lastindex]);
  var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
        ...this.props,
          imagetype: this.props.imagetype || '',
          image: imageFile,


    }
    this.props.navigator.push(nextRoute)


    // }
  }

  renderImage = (asset) => {
    var imageSize = DeviceWidth / 3 - 20;
    var imageStyle = [styles.image, {width: imageSize, height: imageSize}];
    return (
      <TouchableOpacity onPress={ this.loadAsset.bind( this, asset ) } key={`${asset.node.image.uri}-tap`}>
        <View key={asset} style={styles.row}>
          <Image
            source={asset.node.image}
            style={imageStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }
  /**
   * This should be called when the image renderer is changed to tell the
   * component to re-render its assets.
   */
  rendererChanged = () => {
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

  _fetch = (clear) => {
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

    var fetchParams: Object = {
      first: this.props.batchSize,
      groupTypes: this.props.groupTypes,
      assetType: this.props.assetType,
    };
    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams, this._appendAssets.bind(this), (err) => {console.log(err)});
  }

  /**
   * Fetches more images from the camera roll. If clear is set to true, it will
   * set the component to its initial state and re-fetch the images.
   */
  fetch = (clear) => {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => { this._fetch(clear); });
    }
  }

  render() {
    return (
      <View>
        <FakeNavBar
          navigator={this.props.navigator}
          onPrev={() => { this.props.goBack ? this.props.goBack() : this.props.navigator.pop()}}
          prevTitle={'Back'}
          backgroundStyle={{}}
          style={{borderBottomWidth:1,borderBottomColor:colors.dusk}}
        />
        <ListView
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooterSpinner}
          onEndReached={this._onEndReached}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          dataSource={this.state.dataSource}
          />
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

  _renderFooterSpinner = () => {
    if (!this.state.noMore) {
      return <ActivityIndicatorIOS style={styles.spinner} />;
    }
    return null;
  }


  _renderRow = (rowData, sectionID, rowID) =>  {
    var images = rowData.length ? rowData.map((image) => {
      if (image === null) {
        return null;
      }
      return this.renderImage(image)
    }) : [ this.renderImage(rowData) ];
    return (
      <View style={styles.row} key={`${rowID}-row`}>
        {images}
      </View>
    );
  }

  _appendAssets = (data) => {
    var assets = data.edges;
    var newState: Object = { loadingMore: false };

    if (!data.page_info.has_next_page) {
      newState.noMore = true;
    }

    if (assets.length > 0) {
      newState.lastCursor = data.page_info.end_cursor;
      newState.assets = this.state.assets.concat(assets);
      newState.dataSource = this.state.dataSource.cloneWithRows(newState.assets);
    }

    this.setState(newState);
  }

  _onEndReached =()=> {
    if (!this.state.noMore) {
      this.fetch();
    }
  }
}

var styles = StyleSheet.create({
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 0,
    width: DeviceWidth / 3 - 20,
    alignItems: 'center',
  },

  image: {
  },

  scrollContent:{
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: DeviceWidth,
  },
  container: {
    flex: 1,
    height:DeviceHeight,
    width: DeviceWidth
  },
})

export default CameraRollView
