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

import SharedStyles from '../../SharedStyles'
import colors from '../../utils/colors';
import SelfImage from './SelfImage';
import PrivacyScreen from './privacy';
import UserActions from '../../flux/actions/UserActions';
import AppActions from '../../flux/actions/AppActions';

import Dimensions from 'Dimensions';
import {BlurView,VibrancyView} from 'react-native-blur'
import ContinueButton from '../../controls/ContinueButton'
import BackButton from '../../components/BackButton'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const CropBoxSize = DeviceWidth * 0.6;

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

class EditImageThumb extends Component{
  constructor(props){
    super()
    this._isMounted = true;
    this.state = {
      measuredSize: null,
      croppedImageURI: null,
      cropError: null,
    };

  }

  accept(cropped){

    AppActions.toggleOverlay()
        //
        // CameraRoll.getPhotos({first:1}, (imgdata)=> {
        //   const img = imgdata.edges[0].node.image
        //   UserActions.uploadImage( img ,'avatar')
        // },
        // (errr)=> {
        //   console.log( errr ,'errr')
        // } )
      UserActions.uploadImage( cropped ,'avatar')

    if(this.props.navigator.getCurrentRoutes()[0].id == 'potentials'){

      console.log('from settings')
      this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
      return
    }else{

      var lastindex = this.props.navigator.getCurrentRoutes().length;
      console.log(lastindex);
      var nextRoute = this.props.stack[lastindex];
      UserActions.updateUserStub({ready:true})
      nextRoute.passProps = {
        ...this.props,
        image:this.props.image,
        croppedImage: this.state.croppedImageURI,
        image_type:'avatar'
      }


      this.props.navigator.push(nextRoute)
    }
    AppActions.showCheckmark();

  }


  _renderImageCropper() {
    if (!this.props.image) {
      return (
        <View style={styles.container} />
      );
    }
    var error = null;
    if (this.state.cropError) {
      error = (
        <Text>{this.state.cropError.message}</Text>
      );
    }
    var cropsize = { width: CropBoxSize, height: CropBoxSize }
    var img = this.props.image;
    console.log('immmgg',img)
    return (
      <View style={styles.container}>
      <Image source={this.props.image}
      resizeMode={Image.resizeMode.cover} style={{width:DeviceWidth,height:DeviceHeight}}>
        <View  style={styles.blurbg}/>

 <View style={{width:100,height:50,left:20}}>
        <BackButton navigator={this.props.navigator}/>
      </View>

        <View style={styles.innerWrap}>
          <View style={styles.circleCropbox}>

            <ImageCropper
              image={ { uri: this.props.image.hasOwnProperty('uri') ? this.props.image.uri : this.props.image, width: this.state.measuredSize.width, height: this.state.measuredSize.height, isStored: true } }
              size={cropsize}
              style={[styles.imageCropper, cropsize]}
              onTransformDataChange={(data) => this._transformData = data}
            />
          </View>
          <Text style={styles.cropButtonLabel}>
            DRAG & PINCH
            </Text>
          <Text style={[{color:colors.white}]}>
            TO CENTER YOUR FACE
          </Text>

        </View>

        <ContinueButton
        canContinue={true}
             handlePress={this._crop.bind(this)}
        />


        </Image>
        </View>

    );
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
    );
  }

  _crop() {
    const {image} = this.props
    const uri = image.uri || image
    console.log(image, uri, this.props)
    ImageEditingManager.cropImage(
      uri,
        this._transformData,
      (croppedImageURI) => { this.setState({croppedImageURI}); this.accept(croppedImageURI)},
      (cropError) => { console.log(cropError); this.setState({cropError}) }
    );
  }

  _reset() {
    this.setState({
      croppedImageURI: null,
      cropError: null,
    });
  }


  render() {
    if (!this.state.measuredSize) {

    return (
      <View
          style={styles.container}
          onLayout={(event) => {
            let measuredWidth = event.nativeEvent.layout.width,
                measuredHeight = event.nativeEvent.layout.height;
            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: measuredHeight},
            });
          }}
        />
    );
   }
      return this._renderImageCropper();
  }
  retake =()=> {
    this.props.navigator.pop();
  }
}




class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;

  componentWillMount() {
    console.log(this.props.image)
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    if (widthRatio < heightRatio) {
      this._scaledImageSize = {
        width: this.props.image.width / widthRatio,
        height: this.props.image.height / heightRatio ,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / widthRatio,
        height: this.props.size.height / heightRatio,
      };
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / PixelRatio.get(),
      y: (this._scaledImageSize.height - this.props.size.height) / PixelRatio.get(),
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
    var offsetRatioX = offset.x / scaledImageSize.width;
    var offsetRatioY = offset.y;
    var sizeRatioX = croppedImageSize.width;
    var sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    this.props.onTransformDataChange && this.props.onTransformDataChange({
      offset: {
        x: this.props.image.width * offsetRatioX,
        y: this.props.image.height * offsetRatioY,
      },
      size: {
        width: this.props.image.width * sizeRatioX,
        height: this.props.image.height * sizeRatioY,
      },
    });
  }


  render() {
    var decelerationRate =
      RCTScrollViewConsts && RCTScrollViewConsts.DecelerationRate ?
        RCTScrollViewConsts.DecelerationRate.Fast :
        0;

    return (
      <ScrollView
        alwaysBounceVertical={true}
        automaticallyAdjustContentInsets={false}
        contentOffset={this._contentOffset}
        decelerationRate={decelerationRate}
        horizontal={true}
        zoomScale={1}
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
    );
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
    width:DeviceWidth,height:DeviceHeight,position:'absolute',backgroundColor:colors.outerSpace,opacity:0.9
  }
});


export default EditImageThumb;
