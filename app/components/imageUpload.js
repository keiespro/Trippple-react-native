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


    this.props.navigator.push({
      component: CameraControl,
      id:'camera',
      title: 'camera'

    })

  },
  render(){
    return (
    <View style={styles.incontainer}>

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
  _renderScene(route: Navigator.route, navigator: Navigator) {
    return (<route.component {...route.passProps} navigator={navigator} user={this.props.user} />);
  },

  render() {

    return (
      <Navigator
        ref="nav"

        initialRoute={{
          title: 'Image',
           component: Img,
           passProps: {
             stuff: 'yes'
           },
           wrapperStyle: styles.container,
         }}
         renderScene={this._renderScene.bind(this)}
         tintColor={'yellow'}

          />
    );
  },

});


var styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  incontainer:{
    flex: 1,
    paddingTop:50,
    alignItems:'center',
    justifyContent:'space-around'
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
