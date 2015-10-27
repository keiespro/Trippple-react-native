import React from 'react-native'
import {
  Component,
  StyleSheet,
  CameraRoll,
  Text,
  Image,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import Camera from 'react-native-camera';
import colors from '../utils/colors'
import Dimensions from 'Dimensions';
import BackButton from '../components/BackButton'
import EditImageThumb from '../screens/registration/EditImageThumb'
import EditImage from '../screens/registration/EditImage'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class CameraControl extends Component{
  constructor(props){
    super(props)
    this.state = {
      cameraType: Camera.constants.Type.front
    }
  }
  _goBack =()=> {
    this.props.navigator.pop()
  }

  render() {

    return (
      <View style={styles.container} pointerEvents={'box-none'}>

        <View style={styles.paddedTop} pointerEvents={'box-none'}>

        <View style={{marginBottom:10}}>
          <BackButton navigator={this.props.navigator}/>
        </View>
          <TouchableOpacity  onPress={this._switchCamera} style={[{height:50,width:48},styles.rightbutton]}>
            <View>
              <Image
              resizeMode={Image.resizeMode.contain}
              source={require('image!flipCamera')}
              style={{height:25,width:50}}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cameraWrapForShadow}>
        <Camera
          style={styles.cameraBox}
          ref="cam"
          type={this.state.cameraType}
          aspect={Camera.constants.Aspect.fill}
          flashMode={Camera.constants.FlashMode.auto}
          orientation={Camera.constants.Orientation.auto}
          captureTarget={Camera.constants.CaptureTarget.disk}
          >
          <TouchableOpacity style={styles.bigbutton} onPress={this._takePicture.bind(this)} >
            <View style={[{height:80,width:80}]}>
              <Image
              resizeMode={Image.resizeMode.cover} source={require('image!snap')} style={{height:80,width:80}}/>
            </View>
          </TouchableOpacity>
        </Camera>
        </View>
      </View>
    );
  }

  _switchCamera =()=> {
    var state = {};
    state.cameraType = (this.state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back);
    this.setState(state);
  }

  _takePicture =()=> {
    this.refs.cam.capture({},(err, data)=> {
      console.log('IMAGE -',data)
      if(err){console.log('camera err')}
      // CameraRoll.saveImageWithTag(data,
      //   (imageTag)=> {
      //     console.log(imageTag);
      //     //
      //     //
  // CameraRoll.getPhotos({first:1}, (imgdata)=> {
  //     console.log(imgdata,'imgdata')
  //     const imageFile = imgdata.edges[0].node.image
      const imageFile = {uri: data}
      if(this.props.navigator.getCurrentRoutes()[0].id == 'potentials'){
        this.props.navigator.push({
          component: EditImage,
          passProps: {
            ...this.props,
            image: imageFile.uri,
            imageData: data,
            image_type: this.props.image_type || 'profile',
            nextRoute: EditImageThumb
          }
        })

      }else{
        if(this.props.nextRoute){
          this.props.navigator.push({
            component: this.props.nextRoute,
            passProps: {
              ...this.props,
              imageData: data,
              image: imageFile.uri,
              image_type: this.props.image_type || '',
              nextRoute: EditImageThumb
            }
          })
          return

        }else{
          var lastindex = this.props.navigator.getCurrentRoutes().length;
          console.log( 'debug',lastindex );
          var nextRoute = this.props.stack[ lastindex ];

          nextRoute.passProps = {
           ...this.props,
            image: imageFile.uri,
            imageData: data,
            image_type: this.props.image_type || '',
          }
          this.props.navigator.push( nextRoute )
        }
      }
    })
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
    alignItems:'flex-end',
    alignSelf:'stretch',
    justifyContent:'space-between',
    height:60,
    top:10,
    padding:0,
    width:DeviceWidth - 40,

  },
  cameraWrapForShadow:{

    // shadowColor:colors.darkShadow,
    // shadowRadius:6,
    // shadowOpacity:50,
    // shadowOffset: {
    //     width:0,
    //     height: 2
    // },
    marginBottom:40,
    flex: 1,
    flexDirection: 'column',
    alignSelf:'stretch',


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
    position:'relative',

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
       borderRadius:20,
    // marginRight:30
  },
  bigbutton:{
    width:80,
    height:80,
    overflow:'hidden',
    borderRadius:40,
    alignSelf:'center',
    bottom:40,
    position:'relative',
    backgroundColor: 'transparent',

  }
});


module.exports = CameraControl;
