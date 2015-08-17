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


import React from 'react-native';
import {
  ActivityIndicatorIOS,
  CameraRoll,
  Image,
  ListView,
  StyleSheet,
  View,
} from 'react-native';


var propTypes = {
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
  renderImage: React.PropTypes.func,

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
    batchSize: 50,
    imagesPerRow: 3,
    assetType: 'Photos',
    renderImage: (asset) => {
      var imageSize = 150;
      var imageStyle = [styles.image, {width: imageSize, height: imageSize}];
      return (
        <Image
          source={asset.node.image}
          style={imageStyle}
        />
      );
    },

  }
  constructor(props){
    super(props)


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

  /**
   * This should be called when the image renderer is changed to tell the
   * component to re-render its assets.
   */
  rendererChanged = () => {
    var ds = new ListView.DataSource({rowHasChanged: this._rowHasChanged});
    this.state.dataSource = ds.cloneWithRows(this.state.assets);
    //  ds.cloneWithRows(
    //   groupByEveryN(this.state.assets, this.props.imagesPerRow)
    // );
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
            assets: ([]: Array<Image>),
            groupTypes: props.groupTypes,
            lastCursor: (null : ?string),
            assetType: props.assetType,
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
        onEndReached={this._onEndReached.bind(this)}
        style={styles.container}
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
  _renderRow = (rowData, sectionID, rowID) =>  {
    console.log(rowData, sectionID, rowID);
    var images = [ this.props.renderImage(rowData) ];





    return (
      <View style={styles.row}>
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

  _onEndReached() {
    if (!this.state.noMore) {
      this.fetch();
    }
  }
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  url: {
    fontSize: 9,
    marginBottom: 14,
  },
  image: {
    margin: 4,
  },
  info: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default CameraRollView;
