//TODO: try out facebook's ssquare image cropper component
//      https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/ImageEditingExample.js

import React from 'react-native'

import {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
NativeModules,
ScrollView
} from 'react-native';

const ImageEditingManager = NativeModules.ImageEditingManager;
const RCTScrollViewConsts = NativeModules.UIManager.RCTScrollView.Constants;

import SharedStyles from '../../SharedStyles'

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
import colors from '../../utils/colors';
import SelfImage from './SelfImage';
import PrivacyScreen from './privacy';
import UserActions from '../../flux/actions/UserActions';

import Dimensions from 'Dimensions';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const CropBoxSize = DeviceWidth * 0.6;

class ImageEditor extends Component{
  constructor(props){
    super()
    this._isMounted = true;
    this.state = {
      measuredSize: null,
      croppedImageURI: null,
      cropError: null,
    };

  }
  componentWillMount(){
    console.log('will mount editor')
  }

  accept(){
    UserActions.uploadImage(this.props.image,this.props.imagetype)
    if(this.props.navigator.getCurrentRoutes()[0].id === 'potentials'){
      this.props.navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
    }else{
      this.props.navigator.push({
        component: PrivacyScreen,
        id:'priv'

      })
    }
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

    return (
      <View style={styles.container}>
        <View style={styles.innerWrap}>
          <View style={styles.circleCropbox}>

            <ImageCropper
              image={this.props.image}
              size={cropsize}
              style={[styles.imageCropper, cropsize]}
              onTransformDataChange={(data) => this._transformData = data}
            />
          </View>
          <Text style={styles.cropButtonLabel}>
            Drag & pinch to zoom
          </Text>
        </View>

        <View style={[SharedStyles.continueButtonWrap,
            {bottom: 0, backgroundColor: colors.mediumPurple
            }]}>
          <TouchableHighlight
             style={[SharedStyles.continueButton]}
             onPress={this._crop.bind(this)}
             underlayColor="black">
             <View>
               <Text style={SharedStyles.continueButtonText}>CONTINUE</Text>
             </View>
           </TouchableHighlight>
        </View>
        {error}
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
    ImageEditingManager.cropImage(
      this.props.image.uri,
      this._transformData,
      (croppedImageURI) => this.setState({croppedImageURI}),
      (cropError) => this.setState({cropError})
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
            let measuredWidth = event.nativeEvent.layout.width;
            if (!measuredWidth) {
              return;
            }
            this.setState({
              measuredSize: {width: measuredWidth, height: measuredWidth},
            });
          }}
        />
    );
   }
    if (!this.state.croppedImageURI) {
      return this._renderImageCropper();
    }
    return this._renderCroppedImage();

  }
  retake =()=> {
    this.props.navigator.pop();
  }
}




class ImageCropper extends React.Component {
  _scaledImageSize: ImageSize;
  _contentOffset: ImageOffset;

  componentWillMount() {
    var widthRatio = this.props.image.width / this.props.size.width;
    var heightRatio = this.props.image.height / this.props.size.height;
    if (widthRatio < heightRatio) {
      this._scaledImageSize = {
        width: this.props.image.width / widthRatio,
        height: this.props.image.height / widthRatio,
      };
    } else {
      this._scaledImageSize = {
        width: this.props.image.width / heightRatio,
        height: this.props.image.height  / heightRatio,
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
        maximumZoomScale={5.0}
        onMomentumScrollEnd={this._onScroll.bind(this)}
        onScrollEndDrag={this._onScroll.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Image source={this.props.image} style={this._scaledImageSize} />
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
    backgroundColor: colors.outerSpace,
    width: DeviceWidth,
    height: DeviceHeight
  },
  innerWrap:{

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch'



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
    width:DeviceWidth,
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
},
  imageCropper: {
    alignSelf: 'center',
  },
  circleCropbox: {
    width:CropBoxSize,
    height:CropBoxSize,
    overflow:'hidden',
    borderRadius:CropBoxSize/2,
    borderWidth:2,
    borderColor:colors.mediumPurple
  },
  cropButtonLabel:{
    fontFamily:'omnes',
    fontSize:22,
    marginTop:20,
    paddingBottom:30,
    color:colors.white
  }
});


export default ImageEditor;
