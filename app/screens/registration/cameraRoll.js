 ;

var React = require('react-native');
var {
  StyleSheet,
  View,
  TouchableHighlight,
  CameraRoll
} = React;

var Camera = require('react-native-camera');
var EditImage = require('./EditImage');

var CameraRoll = React.createClass({
  getInitialState() {
    return {
      images: CameraRoll.getPhotos()
    }
  },

  render() {
    var images = this.state.images.map((el,i)=>{
      return (
        <TouchableHighlight onPress={this._selectImage.bind(this)}>
          {/*image*/}
        </TouchableHighlight>
      )
    })
    return (
      <View style={styles.container}>

          {images}

      </View>
    );
  },

  _selectImage(e){
    console.log(e);
    
    var img = e.nativeEvent.value;
    this.setState({
      selectedImage: img
    })
  },
  _acceptImage() {

      this.props.navigator.push({
        component: EditImage,
        id:'imageeditor',
        title: 'Edit Image',
        passProps: {
          image: this.state.selectedImage
        }

      })

  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: '#000',
    paddingTop:60,


  },

});


module.exports = CameraRoll;
