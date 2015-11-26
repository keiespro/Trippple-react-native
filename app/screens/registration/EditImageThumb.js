// mostly taken from  https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js

import React from 'react-native'

import {
  Component,
  StyleSheet,
  Text,
  Image,
  CameraRoll,
  View,
  PixelRatio,
  TouchableHighlight,
  NativeModules,
  ScrollView
} from 'react-native';

const ImageEditingManager = NativeModules.ImageEditingManager;
const RCTScrollViewConsts = NativeModules.UIManager.RCTScrollView.Constants;
import OnboardingActions from '../../flux/actions/OnboardingActions'
import OtherBackButton from '../../components/BackButton'

import SharedStyles from '../../SharedStyles'
import colors from '../../utils/colors';
import SelfImage from './SelfImage';
import PrivacyScreen from './privacy';
import UserActions from '../../flux/actions/UserActions';
import AppActions from '../../flux/actions/AppActions';

import Dimensions from 'Dimensions';
import {BlurView,VibrancyView} from 'react-native-blur'
import ContinueButton from '../../controls/ContinueButton'
import BackButton from './BackButton'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const CropBoxSize = 250;

type ImageOffset = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type TransformData = {
  offset: ImageOffset;
  size: ImageSize;
}

function getCropDataForSending(cropData){
  return {
    offset_x: cropData.offset.x,
    offset_y: cropData.offset.y,
    crop_width: cropData.size.width,
    crop_height: cropData.size.height
  }
}

class Imagetest extends Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <View style={{width:DeviceWidth,height:DeviceHeight}}>
        <Image source={{uri:this.props.image}}   />

        </View>
    )
  }
}

class EditImageThumb extends Component{
  constructor(props){
    super()

    this.state = {
      measuredSize: null,
      croppedImageURI: null,
      cropError: null,
    };

  }

  accept(cropped,transformData){
    if(this.props.image_type == 'couple_profile'){
      this.proceed()
    }else{

    React.NativeModules.ImageStoreManager.getBase64ForTag( cropped, (uri) => {

      if(!uri || uri == ''){
        return false
      }

      const dataUri = 'data:image/gif;base64,'+uri,
            localImages = { thumb_url: dataUri, image_url: this.props.image, localUserImage: dataUri, localCoupleImage: dataUri  };

      this.setState({croppedImageURI:dataUri });

      UserActions.updateLocally(localImages)

      const cropData = getCropDataForSending(transformData)

      UserActions.uploadImage.defer( dataUri ,'avatar', cropData)

      // const {user,userInfo} = this.props

      // if(user.status == 'verified' && user.relationship_status == 'couple' && userInfo.couple && userInfo.couple.image_url ){
      //   UserActions.updateLocally({status:'pendingpartner'})
      // }else{
        this.proceed()
      // }

    }, (err) =>{
      console.log(err,'err');
    })

  }

  }

  proceed(){
    if(this.props.navigator.getCurrentRoutes()[1].id == 'settings'){

      if(this.props.navigator.getCurrentRoutes()[2] && this.props.navigator.getCurrentRoutes()[2].id == 'settingsbasic'){
        lastRoute = this.props.navigator.getCurrentRoutes()[2]
      }else{
        lastRoute = this.props.navigator.getCurrentRoutes()[1]
      }

      this.props.navigator.popToRoute(lastRoute)

    }else if(this.props.image_type == 'couple_profile'){

      this.props.navigator.push({
        component: SelfImage,
        passProps: {
          image_type: 'profile'
        }
      })

    }else{
      UserActions.updateLocally({status:'pendingpartner'})
      OnboardingActions.updateRoute(this.props.navigator.getCurrentRoutes().length)
    }

  }

  _renderImageCropper() {
    if (!this.props.image) {
      return (
        <View style={styles.container} />
      )
    }

    const error = this.state.cropError ? <Text>{this.state.cropError.message}</Text> : null,
          cropsize = { width: CropBoxSize, height: CropBoxSize },
          img = this.props.image;

    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.props.image.uri || this.props.image }}
          resizeMode={Image.resizeMode.cover}
          style={{width:DeviceWidth,height:DeviceHeight}}
          >
          <View
            style={styles.blurbg}
          />

          <View style={{width:100,height:50,left:20}}>
          {this.props.navigator.getCurrentRoutes()[0].id == 'potentials' ?
            <OtherBackButton navigator={this.props.navigator}/> :
            <BackButton/>
          }
          </View>

          <View style={styles.innerWrap}>
            <View style={styles.circleCropbox}>

              <ImageCropper
                image={{
                  uri: this.props.image.hasOwnProperty('uri') ? this.props.image.uri : this.props.image,
                  width: this.state.measuredSize.width,
                  height: this.state.measuredSize.height,
                  isStored: true
                }}
                size={cropsize}
                style={[styles.imageCropper, cropsize]}
                onTransformDataChange={(data) => this._transformData = data}
              />
            </View>
            <Text style={styles.cropButtonLabel}>DRAG & PINCH</Text>
            <Text style={[{color:colors.white}]}>TO CENTER YOUR FACE</Text>

          </View>

          <ContinueButton
            canContinue={true}
            handlePress={this._crop.bind(this)}
          />

        </Image>
      </View>
    )
  }

  _renderCroppedImage() {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: this.state.croppedImageURI}}
          style={[styles.imageCropper, this.state.measuredSize]}
        />
        <TouchableHighlight
          style={styles.cropButtonTouchable}
          onPress={this._reset.bind(this)}>
          <View style={styles.cropButton}>
            <Text style={styles.cropButtonLabel}>
              Try again
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  skip(){
    this.proceed()
  }

  _crop() {
    const {image} = this.props
    const uri = image.uri || image;

    ImageEditingManager.cropImage( uri, this._transformData,
      (croppedImageURI) => {  this.accept(croppedImageURI,this._transformData)},
      (cropError) => { console.log(cropError); this.setState({cropError}) }
    );
  }

  _reset() {
    this.setState({
      croppedImageURI: null,
      cropError: null,
    })
  }

  retake =()=> {
    this.props.navigator.pop()
  }

  render() {
    if (!this.state.measuredSize) {

      return (
        <View
        style={styles.container}
        onLayout={ (event) => {
          const measuredWidth = event.nativeEvent.layout.width;
          if (!measuredWidth) { return; }

          this.setState({
            measuredSize: {width: measuredWidth, height: event.nativeEvent.layout.height},
          });
        }}
        />
      );
    }

    return this._renderImageCropper();
  }
}




class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;

  componentWillMount() {
    // Scale an image to the minimum size that is large enough to completely
    // fill the crop box.
    const widthRatio = this.props.image.width / this.props.size.width,
          heightRatio = this.props.image.height / this.props.size.height;

    if (widthRatio < heightRatio) {
      this._scaledImageSize = {
        width: this.props.size.width,
        height: this.props.image.height / widthRatio,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.size.height,
      };
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / 2,
      y: (this._scaledImageSize.height - this.props.size.height) / 2,
    };
    this._updateTransformData(
      this._contentOffset,
      this._scaledImageSize,
      this.props.size
    );
  }

  _onScroll(event) {
    this._updateTransformData(
      event.nativeEvent.contentOffset,
      event.nativeEvent.contentSize,
      event.nativeEvent.layoutMeasurement
    );
  }

  _updateTransformData(offset, scaledImageSize, croppedImageSize) {
    const MN = 1.667; // perhaps not entirely correct

    const offsetRatioX = offset.x / scaledImageSize.width,
          offsetRatioY = offset.y / scaledImageSize.height,
          sizeRatioX = croppedImageSize.width / scaledImageSize.width,
          sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    this.props.onTransformDataChange && this.props.onTransformDataChange({
      offset: {
        x: this.props.image.width * offsetRatioX * MN,
        y: this.props.image.height * offsetRatioY * MN,
      },
      size: {
        width: this.props.image.width * sizeRatioX * MN,
        height: this.props.image.height * sizeRatioY * MN,
      },
    });
  }


  render() {
    const decelerationRate = RCTScrollViewConsts && RCTScrollViewConsts.DecelerationRate ?
          RCTScrollViewConsts.DecelerationRate.Fast : 0;

    return (
      <ScrollView
        ref={'scrollref'}
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={false}
        contentOffset={this._contentOffset}
        decelerationRate={decelerationRate}
        horizontal={true}
        minimumZoomScale={0.5}
        maximumZoomScale={5.0}
        onMomentumScrollEnd={this._onScroll.bind(this)}
        onScrollEndDrag={this._onScroll.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        >
        <Image source={this.props.image} resizeMode={Image.resizeMode.cover} style={this._scaledImageSize} />
      </ScrollView>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor:'transparent',
    width: DeviceWidth,
    height: DeviceHeight
  },
  innerWrap:{
    flex: 1,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch'
  },
  imageCropper: {
    alignSelf: 'center',
  },
  circleCropbox: {
    width:CropBoxSize,
    height:CropBoxSize,
    overflow:'hidden',
    borderRadius:CropBoxSize/2,
  },
  cropButtonLabel:{
    fontFamily:'Montserrat-Bold',
    fontSize:22,
    marginTop:40,
    paddingBottom:0,
    color:colors.white
  },
  blurbg:{
    width:DeviceWidth,
    height:DeviceHeight,
    position:'absolute',
    backgroundColor:colors.outerSpace,
    opacity:0.9
  }
});


export default EditImageThumb;
