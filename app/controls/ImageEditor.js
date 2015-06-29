'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} = React;

var UserActions = require('../flux/actions/UserActions');

var ImageEditor = React.createClass({


  render() {

    return (
      <View style={styles.container}>
        <Image
          style={styles.cameraBox}
          source={{uri: this.props.image}}
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


  },
  _takePicture() {
    UserActions.uploadImage(this.props.image);
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
    alignSelf:'stretch',
    width:300,
    height:300
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


module.exports = ImageEditor;