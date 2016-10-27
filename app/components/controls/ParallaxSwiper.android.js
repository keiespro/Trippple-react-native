import React from 'react';
import {StyleSheet, Image, View, ScrollView, Platform, Animated, Dimensions} from 'react-native';
import colors from '../../utils/colors'
import Swiper from './swiper'

const iOS = Platform.OS == 'ios';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
const DeviceWidth = screen.width
const DeviceHeight = screen.height
const TOP_DISTANCE = DeviceHeight - 260;

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
    }
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
    this.state.scrollY.addListener(this.maybeKillProfile.bind(this))
  }

  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  maybeKillProfile(e){
    if (!this.state.wasKilled && e.value <= -100){
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
    Animated.timing(this.state.imgLoaded, {
      duration: 300,
      toValue: 100,
    }).start(() => {

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
      if (!image_url || image_url.length == 0){ image_url = null }
      else {
        image_url = image_url.replace('test/', '').replace('images/', '')
      }
      return (

        <Image
          source={{uri: image_url }}
          defaultSource={require('../screens/potentials/assets/defaultuser.png')}
          key={`${p.id}slide${i}`}
          onLoad={this.imgLoad.bind(this)}
          style={{
            height:profileVisible ? this.props.height : this.props.height-60,
            width:DeviceWidth,
            overlayColor: 'transparent',
            borderRadius: 11,
          }}
        />
      )
    });

     return (
      <Animated.View
      pointerEvents={'box-none'}
         style={[styles.background, {
         elevation:0,
          shadowColor: colors.darkShadow,
          shadowOpacity: 0.4,
          shadowRadius: 30,
          shadowOffset: {
            width: 0,
            height: -10
          },
          flex: 1,
          position:'absolute',
          top:0,
          borderRadius: 11,
          backgroundColor:  iOS && this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
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
            scrollEnabled
            profileVisible={this.props.profileVisible}
            inCard
            autoplay
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
  //  console.log(e.nativeEvent);
    console.log( e.nativeEvent.contentOffset.y);
  //  if(300 - e.nativeEvent.contentOffset.y > 0  ){
    //  this._scrollView.setNativeProps({scrollEnabled:false})
   //
  //  }else{
  //    this._scrollView.setNativeProps({scrollEnabled:false})
   //
  //  }
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
  onResponderMove={e=>{console.log('onResponderMove',e.nativeEvent.target)}}
  onResponderTerminationRequest={e=>{console.log('onResponderTerminationRequest',e.nativeEvent)}}

  */}
      {profileVisible &&   <ScrollView
          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          scrollEnabled={profileVisible}
          keyboardShouldPersistTaps
          showsVerticalScrollIndicator={false}
          onScroll={this.handleScroll.bind(this)}
          onMoveShouldSetResponderCapture={(e) => {
            this._scrollView.setNativeProps({scrollEnabled:false})

            console.log('onMoveShouldSetResponderCapture',e.nativeEvent.pageY);
             return false
          }}
          onResponderGrant={e=>{
            console.log('START',this._scrollView,e.nativeEvent.target)
            // this._scrollView.setNativeProps({contentContainerStyle:{height:null}})
            this._scrollView._innerViewRef.setNativeProps({style:{
              // height:this.state.contentHeight+1000,
              backgroundColor:colors.outerSpace50
            }})
          }}
          onResponderRelease={e => {
            console.log('START',this._scrollView,e.nativeEvent.target)
            this._scrollView._innerViewRef.setNativeProps({style:{backgroundColor:colors.dark70}})
          }}
          onResponderTerminate={e => {
            console.log('START',this._scrollView,e.nativeEvent.target)
            this._scrollView._innerViewRef.setNativeProps({style:{backgroundColor:colors.dark70}})
          }}
          onResponderReject={e => {
            console.log('START',this._scrollView,e.nativeEvent.target)
            this._scrollView._innerViewRef.setNativeProps({style:{backgroundColor:colors.dark70}})
          }}

          onMoveShouldSetResponder={(e) => {
            console.log(e.nativeEvent.locationY, e.nativeEvent.pageY);
            if(e.nativeEvent.pageY > e.nativeEvent.locationY) this._scrollView.setNativeProps({scrollEnabled:true})
             //
            //  if(e.nativeEvent.pageY > 300 ){
            //    return false
             //
            //  }else{
            //    return false
             //
            //  fa,s
            return false
           }}
          contentContainerStyle={{
            elevation:10,
            height:DeviceHeight+200,
            zIndex:1,
            flex:1,
            top:TOP_DISTANCE

          }}
          style={[
            styles.scrollView, {
              flex:10,
              marginBottom: iOS ? -500 : 0,
              height:this.state.DeviceHeight+TOP_DISTANCE,
              flexGrow: 10,
              flexDirection:'row',
              alignSelf:'stretch'
            }
          ]}
          vertical
          scrollEventThrottle={256}
        >

          <View
            style={{
              top: 0,
              zIndex: 0,
              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              backgroundColor: colors.outerSpace70,
              paddingTop:0
            }}

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
    flex: 1,
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
