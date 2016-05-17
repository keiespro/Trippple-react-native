import React, {Component,PropTypes} from "react";
import {Dimensions,StyleSheet, CameraRoll, Text, Image, View, TouchableOpacity, TouchableHighlight} from "react-native";

import Camera from '../RNCamera-FIX';
import colors from '../utils/colors'
import BackButton from '../components/BackButton'
import EditImageThumb from '../screens/registration/EditImageThumb'
import EditImage from '../screens/registration/EditImage'
import OnboardingActions from '../flux/actions/OnboardingActions'
import OnboardingBackButton from '../screens/registration/BackButton'
import Analytics from '../utils/Analytics'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class CameraControl extends Component{
  constructor(props){
    super(props)
    this.state = {
      cameraType: Camera.constants.Type.front
    }
  }
  // _goBack(){
  //   this.setState({
  //     image: null
  //   })
  //   if(this.props.navigator.getCurrentRoutes()[0].id == 'potentials'){

  //     this.props.navigator.pop()
  //   }else{
  //     OnboardingActions.proceedToPrevScreen()
  //   }
  // }

  render() {

    return (
      <View style={styles.container} pointerEvents={'box-none'}>

        <View style={styles.paddedTop} pointerEvents={'box-none'}>

        <View style={{marginBottom:10}}>
          {this.props.navigator.getCurrentRoutes()[0].id == 'potentials' ? <BackButton navigator={this.props.navigator}/> : <OnboardingBackButton/> }
        </View>
          <TouchableOpacity  onPress={this._switchCamera.bind(this)} style={[{height:50,width:48},styles.rightbutton]}>
            <View>
              <Image
              resizeMode={Image.resizeMode.contain}
              source={{uri: 'assets/flipCamera@3x.png'}}
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
          orientation={Camera.constants.Orientation.portrait}
          captureTarget={Camera.constants.CaptureTarget.disk}
          >
          <TouchableOpacity style={styles.bigbutton} onPress={this._takePicture.bind(this)} >
            <View style={[{height:80,width:80}]}>
              <Image
              resizeMode={Image.resizeMode.cover} source={{uri: 'assets/snap@3x.png'}} style={{height:80,width:80}}/>
            </View>
          </TouchableOpacity>
        </Camera>
        </View>
      </View>
    );
  }

  _switchCamera(){
    var state = {};
    state.cameraType = (this.state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back);
    this.setState(state);
  }

  _takePicture(){

    this.refs.cam.capture({},(err, data)=> {
       if(err){ Analytics.log(err); return }
      // CameraRoll.saveImageWithTag(data,
      //   (imageTag)=> {
      // CameraRoll.getPhotos({first:1}, (imgdata)=> {
        //     const imageFile = imgdata.edges[0].node.image
      const imageFile = {uri: data}
      if(this.props.navigator.getCurrentRoutes()[0].id == 'potentials'){
        this.props.navigator.push({
          component: EditImage,
          id: 'ee',
          passProps: {
            image: imageFile.uri,
            imageData: data,
            image_type:  this.props.image_type ||  'profile',
            nextRoute: EditImageThumb
          }
        })

      }else{
        if(this.props.nextRoute){
          this.props.navigator.push({
            component: this.props.nextRoute,
            passProps: {
              imageData: data,
              image: imageFile.uri,
              image_type: this.props.image_type || 'profile',
              nextRoute: EditImageThumb
            }
          })

        }else{
          this.props.navigator.push({
            component: EditImage,
            id:'zzzzz',
            passProps: {
              imageData: data,
              image: imageFile,
              image_type: this.props.image_type || 'profile',
            }
          })
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


export default CameraControl;
