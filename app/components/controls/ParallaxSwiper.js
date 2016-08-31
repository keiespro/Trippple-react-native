
import React from "react";
import {StyleSheet, View, ScrollView, Animated, Dimensions,TouchableOpacity,Image} from "react-native";

import {VibrancyView} from 'react-native-blur';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;



class ParallaxSwiper extends React.Component{

  static propTypes = {
    ...ScrollViewPropTypes,
    windowHeight: React.PropTypes.number,
    blur: React.PropTypes.string,
    contentInset: React.PropTypes.object,
  };

  static getDefaultProps = {
    windowHeight: 300,
    contentInset: {
      top: -20 * screen.scale
    }
  };

  constructor(props){
    super();
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

    /**
     * IMPORTANT: You must return the scroll responder of the underlying
     * scrollable component from getScrollResponder() when using ScrollableMixin.
     */
  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  renderBackground() {
    let { windowHeight, swiper, blur } = this.props;
    let { scrollY } = this.state;
    if (!windowHeight || !swiper) {
      return null;
    }
    windowHeight = screen.height;
    return (
            <View style={{ borderTopLeftRadius:8,borderTopRightRadius:8,overflow:'hidden',}}>
              <Animated.View
              style={[styles.background, {

                    backgroundColor: this.props.isTopCard ? this.props.pan.x.interpolate({
                      inputRange: [-300, -80, -10, 0, 10, 80, 300],
                      outputRange: [
                        'rgb(232,74,107)',
                        'rgb(232,74,107)',
                        'rgb(255,255,255)',
                        'rgb(255,255,255)',
                        'rgb(255,255,255)',
                        'rgb(66,181,125)',
                        'rgb(66,181,125)',
                      ],
                    }) : 'white',
                  transform: [{
                    scale: scrollY.interpolate({
                      inputRange: [ -windowHeight, 0, windowHeight,windowHeight+2],
                      outputRange: [1.5, 1.2, 1,1]
                    })
                  }]
                }]}>
                  {React.cloneElement(swiper,{
                    profileVisible:this.props.profileVisible,
                    inCard:true,
                    isTopCard:this.props.isTopCard,
                    paginationStyle: {
                      top:50,
                      backgroundColor:'transparent',
                      position:'absolute',
                      right:50
                    }
                })}
              </Animated.View></View>
        );
  }



  render() {
    let { style,windowHeight,swiper, ...props } = this.props;
    return (
          <View style={[styles.container, style]}>
            <ScrollView
              {...props}
              automaticallyAdjustContentInsets={false}
              ref={component => { this._scrollView = component; }}
              stickyHeaderIndices={[0]}
              contentContainerStyle={{marginTop:windowHeight,backgroundColor:'transparent'}}
              style={[styles.scrollView,]}
              onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                )}
              scrollEventThrottle={16}>
              {this.renderBackground()}
              {this.props.children}
            </ScrollView>
           </View>
        );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:-10
  },
  scrollView: {
    backfaceVisibility:'hidden'
  },
  background: {
    // position: 'absolute',
    // width: screen.width,\
    position:'relative',
    // backgroundColor:'red',
    // backfaceVisibility:'hidden',
    top:-0,
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
