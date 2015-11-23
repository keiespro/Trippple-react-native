//TODO: try out facebook's ssquare image cropper component
//      https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js
// https://github.com/facebook/react-native/blob/62e8ddc20561a39c3c839ab9f83c95493df117c0/Libraries/Image/RCTImageEditingManager.m


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
  AlertIOS,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import colors from '../../utils/colors';
import UserActions from '../../flux/actions/UserActions';
import SharedStyles from '../../SharedStyles'
import Privacy from './privacy';
import EditImageThumb from './EditImageThumb'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import SelfImage from './SelfImage'
import Dimensions from 'Dimensions';

const {ImageEditingManager,ImageStoreManager} = NativeModules;
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

   }

  accept(croppedImageURI){
    // CameraRoll.getPhotos({first:1}, (imgdata)=> {
      // const img = imgdata.edges[0].node.image

      var localImages = { image_url: null, thumb_url: null }
      if(this.props.image_type == 'couple_profile'){
        localImages.couple = {...this.props.user.couple, ...localImages}
        localImages.localCoupleImage = this.props.image

      }else{
        localImages.localUserImage = this.props.image
      }
      UserActions.uploadImage( this.props.image, this.props.image_type )    // },
    // (errr)=> {
    //   console.log( errr ,'errr')
    // } )
    const nextRoute =  EditImageThumb

    this.props.navigator.push({
        component:  nextRoute,
        passProps: {
          image:this.props.image,
          // croppedImage: croppedImageURI,
          image_type: this.props.image_type
        }
      })

  }
  retake =()=> {
    this.props.navigator.getCurrentRoutes()[0].id == 'potentials' ? this.props.navigator.pop() :   OnboardingActions.proceedToPrevScreen()
  }


  render() {
    if (!this.state.measuredSize) {
      return (
        <View
          style={styles.container}
          onLayout={(event) => {
            var measuredWidth = event.nativeEvent.layout.width,
                measuredheight = event.nativeEvent.layout.height;

            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: measuredheight },
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
    console.log('IMAGE',this.props.image)
    var {image} = this.props
    var uri = image.uri ? image.uri : image

    return (
      <View style={styles.container}>
        <View style={styles.innerWrap}>

          <View style={[styles.cardCropper]}>

            <ImageCropper
              image={ { uri: uri, width: this.state.measuredSize.width, height: this.state.measuredSize.height, isStored: true } }
              size={this.state.measuredSize}
              style={[styles.imageCropper,{borderRadius:5,overflow:'hidden',}]}
              onTransformDataChange={(data) => this._transformData = data}
              />
            <TouchableOpacity onPress={this.retake} style={styles.bigbutton}>
               <View style={[{height:80,width:80}]}>
                <Image resizeMode={Image.resizeMode.cover} source={require('../../../newimg/redo.png')} style={{height:80,width:80}}/>
              </View>
            </TouchableOpacity>
          </View>

          </View>
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
    var {image} = this.props
    var uri = image.uri ? image.uri : image
    this.accept()
    // ImageEditingManager.cropImage(
    //   uri,
    //   this._transformData,
    //   (croppedImageURI) => {   this.setState({croppedImageURI}); this.accept(croppedImageURI); },
    //   (cropError) => { console.log('cropError',cropError); this.setState({cropError}) }
    // );
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
    var offsetRatioX = offset.x / scaledImageSize.width;
    var offsetRatioY = offset.y / scaledImageSize.height;
    var sizeRatioX = scaledImageSize.width;
    var sizeRatioY = scaledImageSize.height;

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
      vertical={true}
      minimumZoomScale={1.0}
      maximumZoomScale={10.0}
      onMomentumScrollEnd={this._onScroll.bind(this)}
      onScrollEndDrag={this._onScroll.bind(this)}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={this.props.style}
      scrollEventThrottle={16}
      >
        <Image source={this.props.image}
          resizeMode={Image.resizeMode.cover}
              style={this._scaledImageSize} />
      </ScrollView>
    );
  }

}

var styles = StyleSheet.create({
  imageCropper: {
    alignSelf: 'center',
    backgroundColor: colors.dark,
    flex:1
  },
  cropButtonTouchable: {
    alignSelf: 'center',
    marginTop: 12,
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
    overflow:'hidden',
    width: DeviceWidth - 40,
    borderRadius: 5,
    top:0,
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
