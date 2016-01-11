'use strict';

import React, { StyleSheet, View, ScrollView, Animated, Dimensions } from 'react-native'

import {VibrancyView} from 'react-native-blur';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
import scrollable from 'react-native-scrollable-decorator';


class ParallaxSwiper extends React.Component{

    static propTypes = {
        ...ScrollViewPropTypes,
        windowHeight: React.PropTypes.number,
        backgroundSource: React.PropTypes.object,
        header: React.PropTypes.node,
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
        var { windowHeight, swiper, blur } = this.props;
        var { scrollY } = this.state;
        if (!windowHeight || !swiper) {
            return null;
        }
        return (
            <Animated.View
                style={[styles.background, {
                    height: windowHeight,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight ],
                            outputRange: [ windowHeight / 2, 0, -windowHeight / 3 ]
                        })
                    },{
                        scale: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight],
                            outputRange: [2, 1, 1]
                        })
                    }]
                }]}>{ swiper }

            </Animated.View>
        );
    }

    renderHeader() {
        let { windowHeight,header, swiper } = this.props;
        let { scrollY } = this.state;
        if (!windowHeight || !swiper) {
            return null;
        }
        return (
            {header}
        );
    }

    render() {
        let { style,windowHeight,swiper, ...props } = this.props;
        return (
          <View style={[styles.container, style]}>
            {this.renderBackground()}

            <ScrollView
              ref={component => { this._scrollView = component; }}
              {...props}
              contentContainerStyle={{marginTop:windowHeight}}
              style={[styles.scrollView,]}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
              )}
              scrollEventThrottle={16}>
              {this.props.children}
            </ScrollView>
            {this.renderHeader()}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: 'transparent',
    },
    background: {
        position: 'absolute',
        width: screen.width,
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
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column'
    }
});

export default ParallaxSwiper
