var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;

var CameraControl = require('../controls/cameraControl');

var Img = React.createClass({
  _getCameraRoll() {


  },
  _getCamera() {


    this.props.nav.push({
      component: CameraControl,
      id:'photo2',
      title: 'photo2',
      passProps:{
        x:2
      }
    })

  },
  render(){
    return (
    <View style={styles.container}>

        <TouchableHighlight onPress={this._getCameraRoll}>
          <Text style={styles.textS}>Camera Roll</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._getCamera}>
          <Text style={[styles.textS,styles.textbottom]}>Take Picture</Text>
        </TouchableHighlight>


    </View>)
  }
})
var ImageUpload = React.createClass({
  render() {

    return (
      <View>
      <Navigator
        ref="nav"
        initialRoute={{
           component: Img,
           title: 'Image Upload',
           passProps: {},
           sceneConfig: Navigator.SceneConfigs.FloatFromBottom
         }}
          />
        </View>
    );
  },

});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    alignSelf: 'stretch',
    height:400
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
