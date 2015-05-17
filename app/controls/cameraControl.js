var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var Camera = require('react-native-camera');

var CameraControl = React.createClass({
  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back
    }
  },

  render() {

    return (
      <View style={styles.container}>
        <Camera
        style={styles.cameraBox}
          ref="cam"
          type={this.state.cameraType}
          captureTarget={Camera.constants.CaptureTarget.disk}
        />

        <TouchableHighlight onPress={this._switchCamera}>
          <Text style={styles.textS}>The old switcheroo</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._takePicture}>
          <Text style={styles.textS}>Take Picture</Text>
        </TouchableHighlight>
      </View>
    );
  },
  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },
  _takePicture() {
    this.refs.cam.capture(function(err, data) {
      console.log(err, data);
    });
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cameraBox:{
    paddingTop:60,
    flex:1,
    paddingBottom:100,
    backgroundColor: 'transparent',
    alignSelf:'stretch'
  },
  textS:{
    color:'#ffffff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});


module.exports = CameraControl;
