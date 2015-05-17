var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;

var CameraControl = require('../controls/cameraControl');

var ImageUpload = React.createClass({
  render() {

    return (
      <View style={styles.container}>

        <TouchableHighlight onPress={this._getCameraRoll}>
          <Text style={styles.textS}>Camera Roll</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._getCamera}>
          <Text style={[styles.textS,styles.textbottom]}>Take Picture</Text>
        </TouchableHighlight>
      </View>
    );
  },
  _getCameraRoll() {


  },
  _getCamera() {

    var nav = Navigator.getContext(this);
    console.log(nav,nav.parentNavigator);
    nav.push({
      component: CameraControl,
      id:'photo2',
      title: 'photo2',
      passProps:{
        x:2
      },
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
    })

  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textS:{
    color:'#111'
  },
  textbottom:{
    marginTop: 20,
    fontSize: 20
  }
});


module.exports = ImageUpload;
