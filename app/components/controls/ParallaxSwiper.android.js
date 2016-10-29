import React from 'react';
import {StyleSheet, Image, View, ScrollView, Platform, Animated, Dimensions} from 'react-native';
import colors from '../../utils/colors'
import Swiper from './swiper'

const iOS = Platform.OS == 'ios';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
const DeviceWidth = screen.width
const DeviceHeight = screen.height
const TOP_DISTANCE = DeviceHeight - 160;

class ParallaxSwiper extends React.Component{

  static propTypes = {
    ...ScrollViewPropTypes,
    windowHeight: React.PropTypes.number,
    blur: React.PropTypes.string,
    // contentInset: React.PropTypes.object,
  };

  static getDefaultProps = {
    windowHeight: 0,
    contentInset: {
      top: -20 * screen.scale
    },
    contentWidth: DeviceWidth,
    contentHeight: DeviceHeight
  };

  constructor(){
    super();
    this.state = {
      scrollY: new Animated.Value(0),
      imgLoaded: new Animated.Value(0),
    };
    this._scrollView = {};
  }

  componentDidMount(){
    // this.state.scrollY.addListener(this.maybeKillProfile.bind(this))
      //
      // setTimeout(()=>{
      //     console.log(this._scrollView)
      //     const snode = this._scrollView
      //
      //     console.log('SNODE',snode);
      //     // this.setState({
      //     //   snode
      //     // })
      //
      //   },3000)

  }

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  maybeKillProfile(e){
    if(!this.state.wasKilled && e.value <= -100){
      this.state.scrollY.removeListener(this.maybeKillProfile.bind(this))
      this.setState({wasKilled: true})
      this.killProfile()
    }
  }

  killProfile(){
    this._scrollView.scrollTo({x: 0, y: 0, animated: false})

    this.props.killProfile && this.props.killProfile()
    this.setState({wasKilled: false})
  }
  imgLoad(){
    setImmediate(() => {
      Animated.timing(this.state.imgLoaded, {
        duration: 300,
        toValue: 100,
      }).start(() => {

      })
    })
  }

  renderBackground() {
    const { slideFrames, profileVisible, isTopCard } = this.props;
    // const { scrollY } = this.state;
    // if (!windowHeight || !swiper) {
    //   return null;
    // }
    const slides = slideFrames.map((p, i) => {
      let {image_url} = p;
      if(!image_url || image_url.length == 0){ image_url = null }
      else{
        image_url = image_url.replace('test/', '').replace('images/', '')
      }
      return (

        <Image
          source={{uri: image_url }}
          defaultSource={require('../screens/potentials/assets/defaultuser@3x.png')}
          loadingIndicatorSrc={null}
          key={`${p.id}slide${i}`}
          onLoad={this.imgLoad.bind(this)}
          style={{
            height:  this.props.height,
            width: DeviceWidth,
            overlayColor: 'transparent',
            borderRadius: 11,
            alignSelf:'flex-end',
            bottom: this.props.profileVisible ? 0 : -40,
            // top:100
          }}
        />
      )
    });

    return (
      <Animated.View
        pointerEvents={'none'}

        style={[styles.background, {
          // elevation: 0,
          shadowColor: colors.darkShadow,
          shadowOpacity: 0.4,
          shadowRadius: 30,
          alignItems:'flex-end',
          flexDirection:'column',
          shadowOffset: {
            width: 0,
            height: -10
          },
          flex: 1,
          position: 'absolute',
          top: 0,
          borderRadius: 11,
          backgroundColor: iOS && this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
            inputRange: [-300, -180, -50, 0, 50, 180, 300],
            outputRange: [
              'rgb(232,74,107)',
              'rgb(232,74,107)',
              'rgb(232,74,107)',
              'rgb(255,255,255)',
              'rgb(66,181,125)',
              'rgb(66,181,125)',
              'rgb(66,181,125)',
            ],
          }) : 'transparent',
        }]}
      >
        <View
          onLayout={this.props.doOnLayout}
          pointerEvents={'box-none'}
          style={{
            flex: 1,
            borderRadius: 11,
            left: 0,
          }}
        >
          {slides && slides.length > 1 ? <Swiper
            isTopCard={isTopCard}
            horizontal
            pan={this.props.pan}
            dispatch={this.props.dispatch}
            scrollEnabled={this.props.profileVisible}
            profileVisible={this.props.profileVisible}
            inCard
            autoplay={this.props.profileVisible}
            width={DeviceWidth}
            height={this.props.height}
            paginationStyle={{
              top: 0,
              backgroundColor: 'transparent',
              position: 'absolute',
              right: 0
            }}
          >
            {slides}
          </Swiper> : slides}
        </View>

      </Animated.View>
    );
  }
  handleScroll(e) {
   console.log(e.nativeEvent);
    // console.log('handleScroll', e.nativeEvent.contentOffset.y);
    // console.log(this._scrollView)
    //
    // if(e.nativeEvent.contentOffset.y < 300){
    //   this._scrollView.setNativeProps({scrollEnabled: true})
    // }else{
    // //  this._scrollView.setNativeProps({scrollEnabled:false})
    //
    // }
  }

  render() {
    const { style, windowHeight, profileVisible, ...props } = this.props;

    return (
      <View
        pointerEvents={'box-none'}
        style={[
          styles.container, style, {
            borderRadius: 11,
            top: 0,
          }
        ]}
      >
        {this.renderBackground()}

        {/*

          onMoveShouldSetResponder={(e) => {console.log('onMoveShouldSetResponder',e.nativeEvent.pageY); return e.nativeEvent.pageY > 300}}
          onStartShouldSetResponderCapture={(e) => {console.log('onStartShouldSetResponderCapture',e); return false}}
          onStartShouldSetResponder={(e) => {console.log('onStartShouldSetResponder',e); return false}}
          onResponderReject={(e) => {console.log('onResponderReject',e)}}
          onResponderTerminationRequest={e=>{console.log('onResponderTerminationRequest',e.nativeEvent)}}


  */}
        {profileVisible &&
        <ScrollView
          pointerEvents={'box-none'}
          onScroll={this.handleScroll.bind(this)}

          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          scrollEnabled={profileVisible}
          keyboardShouldPersistTaps
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(contentWidth, contentHeight)=> {
            console.log('onContentSizeChange',contentWidth, contentHeight);

            this.setState({
              contentHeight,
              contentWidth

            })
          }}
          contentContainerStyle={{
            flexGrow: 1,
            height: DeviceHeight + TOP_DISTANCE,
            backgroundColor: colors.dark70,
            top: TOP_DISTANCE,
          }}
          style={[
            styles.scrollView, {
              marginBottom: iOS ? -500 : 0,
              height: DeviceHeight,

            }
          ]}
          vertical
          scrollEventThrottle={64}
        >

          <View
            style={{
              top: 0,
              zIndex: 0,
              flexGrow: 1,

              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              backgroundColor: colors.outerSpace70,
              paddingTop: 0
            }}
            pointerEvents={'box-none'}

          >
            {this.props.children}
          </View>
        </ScrollView>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    backfaceVisibility: 'hidden'
  },
  background: {
    position: 'relative',
  },
  blur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  content: {
    shadowColor: '#222',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    flex: 1,
    flexDirection: 'column'
  }
});

export default ParallaxSwiper