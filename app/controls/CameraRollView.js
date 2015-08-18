/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule CameraRollView
 * @flow
 */


import React from 'react-native'
import {
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

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const propTypes = {
  /**
   * The group where the photos will be fetched from. Possible
   * values are 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream'
   * and SavedPhotos.
   */
  groupTypes: React.PropTypes.oneOf([
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
  batchSize: React.PropTypes.number,

  /**
   * A function that takes a single image as a parameter and renders it.
   */
  // renderImage: React.PropTypes.func,

  /**
   * imagesPerRow: Number of images to be shown in each row.
   */
  imagesPerRow: React.PropTypes.number,

   /**
   * The asset type, one of 'Photos', 'Videos' or 'All'
   */
  assetType: React.PropTypes.oneOf([
    'Photos',
    'Videos',
    'All',
  ]),

};

class CameraRollView extends React.Component{
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

    this.props.navigator.push({
      component:this.props.imageEditorComponent,
      id:'imageeditor',
      title: 'Edit Image',
      passProps: {
        image: asset.node.image.uri
      }
    })
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

  componentWillReceiveProps(nextProps: {groupTypes?: string}) {
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
    );
  }

  _rowHasChanged(r1: Array<Image>, r2: Array<Image>): boolean {
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

  // rowData is an array of images
  //
  // ^LIES
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

  _appendAssets = (data: Object) => {
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

  _onEndReached = () => {
    if (!this.state.noMore) {
      this.fetch();
    }
  }
}

const styles = StyleSheet.create({
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
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,

  },
});

export default CameraRollView;
