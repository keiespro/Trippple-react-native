// mostly taken from  https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  NativeModules,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';

import BackButton from '../buttons/BackButton';


const ImageEditingManager = NativeModules.ImageEditingManager;
const RCTScrollViewConsts = NativeModules.UIManager.RCTScrollView.Constants;


import SharedStyles from '../../SharedStyles'
import colors from '../../utils/colors';



import ContinueButton from '../controls/ContinueButton'


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
      busy: false
    };

  }


  accept(cropped,transformData){

      NativeModules.ImageStoreManager.getBase64ForTag( cropped, (uri) => {

        if(!uri || uri == ''){
          return false
        }

        const dataUri = 'data:image/gif;base64,'+uri;
        let localImages;

        if(this.props.image_type == 'couple_profile'){
          localImages = {   localCoupleImage: {uri: dataUri } };
        }else{
          localImages = { thumb_url: dataUri, image_url: dataUri, localUserImage: {uri: dataUri}  };
        }
        this.setState({croppedImageURI:dataUri, busy:false });

        // UserActions.updateLocally(localImages)

        const cropData = getCropDataForSending(transformData)

        // UserActions.uploadImage( dataUri,( this.props.image_type == 'couple_profile' ? 'couple_profile' : 'avatar'))

        if(this.props.alsoUpload){

          if(this.props.alsoUpload.isFB){

              // UserActions.updateLocally({image_url:  this.props.alsoUpload.image,localUserImage: {uri: this.props.alsoUpload.image} })
              // UserActions.uploadImage(this.props.alsoUpload.image,( this.props.alsoUpload.image_type == 'couple_profile' ? 'couple_profile' : 'profile'))
              this.proceed()
         }else{
           var itype = 'profile';
           if(this.props.alsoUpload.image_type && this.props.alsoUpload.image_type.length > 0){
             itype = this.props.alsoUpload.image_type;
           }
          //  UserActions.updateLocally({image_url: this.props.image.uri || this.props.image })
           //
          //  UserActions.uploadImage(this.props.alsoUpload.image, ( this.props.alsoUpload.image_type == 'couple_profile' ? 'couple_profile' : 'profile') )


           this.proceed()


         }
        }else{
          this.proceed()

        }

      }, (err) =>{


       })
  }


  proceed(){
    const currentRoutes = this.props.navigator.getCurrentRoutes()
     if(currentRoutes[1].id == 'Settings'){

      if(currentRoutes[2] && currentRoutes[2].id == 'settingsbasic'){
        lastRoute = currentRoutes[2]
      }else{
        lastRoute = currentRoutes[1]
      }

      this.props.navigator.popToRoute(lastRoute)

    }else if(this.props.image_type == 'couple_profile'){




    }else{
      // UserActions.updateLocally({status:'pendingpartner'})
      // OnboardingActions.updateRoute(currentRoutes.length)
  }
    this.setState({busy:false})


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
                originalImage={this.props.image.hasOwnProperty('uri') ? this.props.image : null}
                size={cropsize}
                busy={this.state.busy}
                style={[styles.imageCropper, cropsize]}
                onTransformDataChange={(data) => this._transformData = data}
              />
            </View>
            <Text style={styles.cropButtonLabel}>DRAG & PINCH</Text>
            <Text style={[{color:colors.white}]}>TO CENTER YOUR FACE</Text>

          </View>

          <ContinueButton
            canContinue={true}
            loading={this.state.busy}
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
    if(this.state.busy){
      return false
    }
    this.setState({busy:true})
    const {image} = this.props
    const uri = image.uri || image;
    ImageEditingManager.cropImage( uri, this._transformData,
      (croppedImageURI) => {  this.accept(croppedImageURI,this._transformData)},
      (cropError) => { this.setState({cropError}) }
    );
  }

  _reset() {
    this.setState({
      croppedImageURI: null,
      cropError: null,
    })
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
      event.nativeEvent.layoutMeasurement,
      event.nativeEvent.zoomScale,
    );
  }

  _updateTransformData(offset, scaledImageSize, croppedImageSize, scale) {
    const MN = 1.667; // works for camera pics only, in place of originalratio
    const zoomscale = scale || 1;
    const offsetRatioX = offset.x / scaledImageSize.width,
          offsetRatioY = offset.y / scaledImageSize.height,
          sizeRatioX = croppedImageSize.width / scaledImageSize.width,
          sizeRatioY = croppedImageSize.height / scaledImageSize.height;

    const { originalImage } = this.props;
    const originalRatio = originalImage && originalImage.width ? ( Math.min(originalImage.width,originalImage.height) / Math.max(originalImage.width,originalImage.height ) + 1) : MN;

    const w = originalImage && originalImage.width ? originalImage.width : this.props.image.width * MN;
    const h = originalImage && originalImage.height ? originalImage.height : this.props.image.height * MN;


    const tData = {
      offset: {
        x: w * offsetRatioX ,
        y: h * offsetRatioY ,
      },
      size: {
        width: w * sizeRatioX ,
        height: h * sizeRatioY ,
      },
    };

    this.props.onTransformDataChange && this.props.onTransformDataChange(tData);

    if(__DEV__ ){
      console.table([{
        'originalRatio':originalRatio,
        'SCALE':zoomscale,
        'offset x':offset.x,
        'offset y':offset.y,
        'scaledImageSize height':scaledImageSize.height,
        'scaledImageSize width':scaledImageSize.width,
        'croppedImageSize height':croppedImageSize.height,
        'croppedImageSize width':croppedImageSize.width,
        'this.props.image.height': this.props.image.height,
        'this.props.image.width':this.props.image.width
      }])
    }
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
        minimumZoomScale={1}
        scrollEnabled={!this.props.busy}
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
    fontFamily:'montserrat',fontWeight:'800',
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
