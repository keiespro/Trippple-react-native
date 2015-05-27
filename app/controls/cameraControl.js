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
      <View style={styles.bottom}>
        <TouchableHighlight onPress={this._switchCamera} style={styles.leftbutton}>
          <View/>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._takePicture} style={styles.bigbutton}>
          <View/>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._switchCamera} style={styles.leftbutton}>
          <View/>
        </TouchableHighlight>
      </View>

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
    alignSelf:'stretch',
    backgroundColor: '#000',
    paddingTop:60,


  },
  bottom:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-around',
    height:100,
    padding:10
  },
  cameraBox:{
    flex:1,
    backgroundColor: 'red',
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
  leftbutton:{
    width:50,
    backgroundColor:'#fff',
    height:50,
    borderRadius:25
  },
  bigbutton:{
    width:80,
    height:80,
    backgroundColor:'red',
    borderRadius:40
  }
});


module.exports = CameraControl;
