import React from 'react';
import {StyleSheet, View, ScrollView, Platform, Animated, Dimensions} from 'react-native';
import colors from '../../utils/colors'
import Swiper from './swiper'

const iOS = Platform.OS == 'ios';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
const DeviceWidth = screen.width
const DeviceHeight = screen.height

class ParallaxSwiper extends React.Component{

  static propTypes = {
    ...ScrollViewPropTypes,
    windowHeight: React.PropTypes.number,
    blur: React.PropTypes.string,
    // contentInset: React.PropTypes.object,
  };

  static getDefaultProps = {
    windowHeight: 300,
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

        <Animated.Image
          source={{uri: image_url }}
          defaultSource={require('../screens/potentials/assets/defaultuser.png')}
          resizeMode="cover"
          key={`${p.id}slide${i}`}
          onLoad={this.imgLoad.bind(this)}
          style={{
            flex: 1,
            alignItems: 'center',
            opacity: this.state.imgLoaded.interpolate({
              inputRange: [0, 50, 100],
              outputRange: [0.0, 0.5, 1.0]
            }),
            // width: this.props.cardWidth,
            overlayColor: profileVisible ? '#000' : colors.outerSpace,
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: -10,
            borderRadius: 11,
            backgroundColor: colors.darkPurple,
            // width:this.props.width,
            // height:this.props.height,

            // marginLeft: profileVisible ? 0 : -40
          }}
        />
      )
    });

        // console.log(this.props.pan,this.props.isTopCard);
    return (
      <Animated.View

        style={[styles.background, {
          shadowColor: colors.darkShadow,
          shadowOpacity: 0.4,
          shadowRadius: 30,
          shadowOffset: {
            width: 0,
            height: -10
          },
          flex: 1,
          borderRadius: 11,
          position: iOS || !this.props.profileVisible ? 'relative' : 'absolute',
          top: iOS ? 0 : 0,
          // backgroundColor:  this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
          //     inputRange: [-300, -180, -50, 0, 50, 180, 300],
          //     outputRange: [
          //         'rgb(232,74,107)',
          //         'rgb(232,74,107)',
          //         'rgb(232,74,107)',
          //         'rgb(255,255,255)',
          //         'rgb(66,181,125)',
          //         'rgb(66,181,125)',
          //         'rgb(66,181,125)',
          //     ],
          // }) : 'white',
        }]}
      >
        <View
          onLayout={this.props.doOnLayout}
          style={{
            flex: 1,
            borderRadius: 11,
            // width: DeviceWidth - 50,
            left: 0,

            // top: 10
          }}
        >
          <Swiper
            isTopCard={isTopCard}
            horizontal
            pan={this.props.pan}
            dispatch={this.props.dispatch}
            scrollEnabled
            profileVisible={this.props.profileVisible}
            inCard
            width={this.props.width}
            height={this.props.height}
            paginationStyle={{
              bottom: 140,
              backgroundColor: 'transparent',
              position: 'absolute',
              right: 0
            }}
          >
            {slides}
          </Swiper>
        </View>

      </Animated.View>
    );
  }

  render() {
    const { style, windowHeight, profileVisible, ...props } = this.props;

    return (
      <View
        style={[
          styles.container, style, {
            borderRadius: 11,
            top: 0,

          }
        ]}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: DeviceWidth,
            height: DeviceHeight,
            backgroundColor: profileVisible ? colors.outerSpace70 : 'transparent',
            borderRadius: 11,
          }}
        >
          {this.renderBackground()}
        </View>

        <ScrollView
          {...props}
          automaticallyAdjustContentInsets={false}
          ref={component => { this._scrollView = component }}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            marginTop: windowHeight,

          }}
          style={[
            styles.scrollView, {
              top: 0,
              marginBottom: iOS ? -500 : 0,

            }
          ]}
          onScroll={Animated.event([{nativeEvent: { contentOffset: { y: this.state.scrollY }}}])}
          scrollEventThrottle={16}
          onScrollAnimationEnd={() => {}}
        >
          <View
            style={{
              top: 500,
              zIndex: 99999,
              borderBottomLeftRadius: 11,
              borderBottomRightRadius: 11,
              backgroundColor: colors.outerSpace70,
              paddingTop:0
            }}
          >
            {this.props.children}
          </View>
        </ScrollView>
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
