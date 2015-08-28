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
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import Dimensions from 'Dimensions'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const propTypes = {
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

class CameraRollView extends Component{
  static propTypes = propTypes

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
    }else{
      this.props.navigator.push({
        component:this.props.nextRoute,
        passProps: {
          imagetype: this.props.imagetype || '',
          image: imageFile,
        }
      })
    }
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
      <ListView
        renderRow={this._renderRow.bind(this)}
        renderFooter={this._renderFooterSpinner}
        onEndReached={this._onEndReached}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        dataSource={this.state.dataSource}
      />
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
    width: DeviceWidth
  },
  container: {
    flex: 1,
    width: DeviceWidth
  },
})

export default CameraRollView
