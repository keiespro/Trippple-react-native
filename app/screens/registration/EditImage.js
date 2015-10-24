//TODO: try out facebook's ssquare image cropper component
//      https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js

import React from 'react-native'

import {
  Component,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  CameraRoll,
  View,
  NativeModules,
  ActivityIndicatorIOS,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import colors from '../../utils/colors';
import UserActions from '../../flux/actions/UserActions';
import SharedStyles from '../../SharedStyles'
import Privacy from './privacy';

import Dimensions from 'Dimensions';

const ImageEditingManager = NativeModules.ImageEditingManager;
const RCTScrollViewConsts = NativeModules.UIManager.RCTScrollView.Constants;


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

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


class EditImage extends Component{
  constructor(props){
    super()

    this.state = {
      measuredSize: null,
      croppedImageURI: null,
      cropError: null,
    };

    console.log(props,props.nextRoute);
  }
  componentWillMount(){
    console.log('will mount editor')
  }

  accept(croppedImageURI){
    console.log(this.props.image,'profile')
    // UserActions.uploadImage(this.props.image.uri,'profile')

    console.log(croppedImageURI);

    if(this.props.afterSaveCallback){
      this.props.afterSaveCallback({
        image:{uri:croppedImageURI,
          width:this._transformData.width,height:this._transformData.height,isStored:false} || this.props.originalImage,
        originalImage:this.props.image,
          croppedImage: croppedImageURI,
          imagetype: this.props.imagetype
      });
      return;
    }
    if(this.props.nextRoute){
    this.props.navigator.push({
        component: this.props.nextRoute,
        passProps: {
          nextRoute: Privacy,
          image:{uri:croppedImageURI,width:this._transformData.width,height:this._transformData.height,isStored:false} || this.props.originalImage,
          originalImage:this.props.image,
          croppedImage: croppedImageURI,
          imagetype: this.props.imagetype
        }
      })

  }else{
   var lastindex = this.props.navigator.getCurrentRoutes().length;
    console.log(lastindex);
    var nextRoute = this.props.stack[lastindex];

     nextRoute.passProps = {
          ...this.props,
          image:{uri:croppedImageURI,width:this._transformData.width,height:this._transformData.height,isStored:false} || this.props.originalImage,
          originalImage:this.props.image,
          croppedImage: croppedImageURI,
          imagetype: this.props.imagetype


    }

    this.props.navigator.push(nextRoute)

  }


  }
  retake =()=> {
    console.log('retake')
    this.props.navigator.pop();
  }


  render() {
    if (!this.state.measuredSize) {
      return (
        <View
          style={styles.container}
          onLayout={(event) => {
            var measuredWidth = event.nativeEvent.layout.width;
            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: event.nativeEvent.layout.height },
            });
          }}/>
      );
    }

      return this._renderImageCropper();
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
    console.warn('IMAGE',this.props.image)
    const uri = this.props.image.uri || this.props.image
    return (
      <View style={styles.container}>
        <View style={styles.innerWrap}>

          <View style={[styles.cardCropper]}>

            <ImageCropper
              image={ { uri: uri, width: this.state.measuredSize.width, height: this.state.measuredSize.height, isStored: true } }
              size={this.state.measuredSize}
              style={[styles.imageCropper,{borderRadius:5,overflow:'hidden'}]}
              onTransformDataChange={(data) => this._transformData = data}
              />
            <TouchableOpacity onPress={this.retake} style={styles.bigbutton}>
               <View style={[{height:80,width:80}]}>
                <Image resizeMode={Image.resizeMode.cover} source={require('image!redo')} style={{height:80,width:80}}/>
              </View>
            </TouchableOpacity>
          </View>

          </View>
          {error}
        <View style={[SharedStyles.continueButtonWrap,
            {bottom: 0, backgroundColor: colors.mediumPurple
            }]}>
          <TouchableHighlight
             style={[SharedStyles.continueButton]}
             onPress={this._crop.bind(this)}
             underlayColor={colors.mediumPurple20}>
             <View>
               <Text style={SharedStyles.continueButtonText}>CONTINUE</Text>
             </View>
           </TouchableHighlight>
        </View>

      </View>
    );
  }


  _crop() {
    const {image} = this.props
    const uri = image.uri || image
    ImageEditingManager.cropImage(
      uri,
      this._transformData,
      (croppedImageURI) => { console.log(croppedImageURI);this.setState({croppedImageURI}); this.accept(croppedImageURI)},
      (cropError) => { console.log(cropError);this.setState({cropError}) }
    );
  }

  _reset() {
    this.setState({
      croppedImageURI: null,
      cropError: null,
    });
  }

}

class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;

  componentWillMount() {
    // Scale an image to the minimum size that is large enough to completely
    // fill the crop box.
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    if (widthRatio > heightRatio) {
      this._scaledImageSize = {
        width: this.props.image.width ,
        height: this.props.image.height / widthRatio,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.image.height  ,
      };
    }
    this._contentOffset = {
      x: (this._scaledImageSize.width - this.props.size.width) / 2,
      y: (this._scaledImageSize.height - this.props.size.height) / 3,
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
    var offsetRatioY = offset.y / scaledImageSize.height;
    var sizeRatioX = croppedImageSize.width / scaledImageSize.width;
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

    /*
    *
    */
    var decelerationRate =
      RCTScrollViewConsts && RCTScrollViewConsts.DecelerationRate ?
        RCTScrollViewConsts.DecelerationRate.Fast :
        0;

    return (
      <ScrollView style={{height:DeviceHeight,width:DeviceWidth}}
      alwaysBounceVertical={true}
      automaticallyAdjustContentInsets={false}
      contentOffset={this._contentOffset}
      horizontal={true}

      maximumZoomScale={4.0}
      onMomentumScrollEnd={this._onScroll.bind(this)}
      onScrollEndDrag={this._onScroll.bind(this)}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={this.props.style}
      scrollEventThrottle={16}
      >
        <Image source={this.props.image}
              style={this._scaledImageSize} />
      </ScrollView>
    );
  }

}

var styles = StyleSheet.create({
  imageCropper: {
    alignSelf: 'center',
    backgroundColor: colors.dark
  },
  cropButtonTouchable: {
    alignSelf: 'center',
    marginTop: 12,
  },
  cropButton: {
    padding: 12,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  innerWrap:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    padding:20
  },

  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace,

  },
  cardCropper:{
    flex: 1,
    flexDirection: 'column',
    alignItems:'stretch',
    justifyContent:'flex-end',
    alignSelf:'stretch',
    width: DeviceWidth - 40,
    borderRadius: 5,
    top:0,
    overflow:'hidden',
    position:'relative',
    shadowColor:colors.darkShadow,
    shadowRadius:15,
    shadowOpacity:80,
    shadowOffset: {
        width:0,
        height: 5
    }

  },
  bigbutton:{
    width:80,
    height:80,
    overflow:'hidden',
    borderRadius:40,
    alignSelf:'center',
    bottom:40,
    marginHorizontal:DeviceWidth/2 - 60,
    position:'absolute',
    backgroundColor: 'transparent',
  }
});


export default EditImage;
