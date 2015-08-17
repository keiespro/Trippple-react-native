
import React from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native'

import Camera from 'react-native-camera';
import ImageEditor from './ImageEditor';

class CameraControl extends React.Component{
  constructor(props) {
    super()
    this.state = {
      cameraType: Camera.constants.Type.back
    }
  }

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
  }
  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  }
  _takePicture() {
    this.refs.cam.capture((err, data)=> {
      console.log(err, data);

      this.props.navigator.push({
        component: ImageEditor,
        id:'imageeditor',
        title: 'Edit Image',
        passProps: {
          image: data
        }

      })

    });
  }
}


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


export default CameraControl
