import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from 'react-native';

import Camera from 'react-native-camera';
import colors from '../utils/colors'
import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class CameraControl extends Component{
  constructor(props){
    super()
    this.state = {
      cameraType: Camera.constants.Type.back
    }
  }
  _goBack =()=> {
    this.props.navigator.pop()
  }
  render() {

    return (
      <View style={styles.container} pointerEvents={'box-none'}>

        <View style={styles.paddedTop} pointerEvents={'box-none'}>
          <TouchableHighlight onPress={this._goBack} style={styles.leftbutton}>
            <Text style={{color:colors.shuttleGray}}>Go Back</Text>
          </TouchableHighlight>

          <TouchableHighlight underlayColor={colors.sushi} onPress={this._switchCamera} style={[{height:60,width:60},styles.rightbutton]}>

              <Image source={require('image!flipCamera')} style={{height:30,width:20}}/>

          </TouchableHighlight>
        </View>

        <Camera
          style={styles.cameraBox}
          ref="cam"
          type={this.state.cameraType}
          captureTarget={Camera.constants.CaptureTarget.disk}
        >
          <TouchableHighlight style={styles.bigbutton} onPress={this._takePicture} >
            <View style={[{height:90,width:90}]}>
              <Image source={require('image!snap')} style={{height:90,width:90}}/>
            </View>
          </TouchableHighlight>
        </Camera>



      </View>
    );
  }
  _switchCamera =()=> {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  }
  _takePicture =()=> {
    this.refs.cam.capture((err, data)=> {
      console.log(err, data);

      this.props.navigator.push({
        component: this.props.imageEditorComponent,
        id:'imageeditor',
        title: 'Edit Image',
        passProps: {
          image: data
        }

      })

    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace,
    paddingHorizontal:20,
    width:(DeviceWidth),
    height:(DeviceHeight),



  },
  paddedTop:{
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-between',
    height:60,
    padding:0,
    width:DeviceWidth - 40,

  },
  cameraBox:{
    flex: 1,
    flexDirection: 'column',
    alignItems:'flex-end',
    justifyContent:'flex-end',
    alignSelf:'stretch',
    borderRadius: 5,
    top:0,
    overflow:'hidden',
    marginBottom:40,
    position:'relative',
    shadowColor:colors.darkShadow,
    shadowRadius:15,
    shadowOpacity:80,
    shadowOffset: {
        width:0,
        height: 5
    }

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
    width:80,
    height:50,
  },
  rightbutton:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:'red',
    // marginRight:30
  },
  bigbutton:{
    width:100,
    height:100,
    overflow:'hidden',
    borderRadius:50,
    alignSelf:'center',
    backgroundColor:colors.sushi,
    bottom:40,
    position:'relative'
  }
});


module.exports = CameraControl;
