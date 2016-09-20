
import React from "react";
import {StyleSheet, View, ScrollView, Animated, Dimensions,TouchableOpacity,Image} from "react-native";
import colors from '../../utils/colors'
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
      scrollY: new Animated.Value(0),

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
  componentDidMount(){

    this.state.scrollY.addListener(this.maybeKillProfile.bind(this))
  }

  maybeKillProfile(e){

    if(!this.state.wasKilled && e.value <= -200){
      this.state.scrollY.removeListener(this.maybeKillProfile.bind(this))
      this.setState({wasKilled: true})
      this.killProfile()
    }
  }

  killProfile(){
      this._scrollView.scrollTo({x:0,y:0,animated:true})
      
      this.props.killProfile && this.props.killProfile()
    //reset
      this.setState({wasKilled: false})
  }
  renderBackground() {
    let { windowHeight, swiper, blur } = this.props;
    let { scrollY } = this.state;
    if (!windowHeight || !swiper) {
      return null;
    }
    windowHeight = screen.height;
    return (
              <Animated.View
              style={[styles.background, {
                 shadowColor: colors.darkShadow,
                 shadowOpacity: 0.6,
                 shadowRadius: 8,
                 shadowOffset: {
                   width:0,
                   height: -12
                 },
              borderRadius:12, 
                 overflow:'visible',
                 backgroundColor:  this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
                      inputRange: [-300, -80, -50, 0, 50, 80, 300],
                      outputRange: [
                        'rgb(232,74,107)',
                        'rgb(232,74,107)',
                        'rgb(232,74,107)',
                        'rgb(255,255,255)',
                        'rgb(66,181,125)',
                        'rgb(66,181,125)',
                        'rgb(66,181,125)',
                      ],
                    }) : 'white',
              }]}>
              <View style={{overflow:'hidden',borderRadius:11,}}>
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
                })}</View>
              </Animated.View>
        );
  }


  render() {
    let { style,windowHeight,swiper, ...props } = this.props;
    return (
          <View style={[styles.container, style, {top:-30}]}>
            <ScrollView
              {...props}
              automaticallyAdjustContentInsets={false}
              ref={component => { this._scrollView = component; }}
              stickyHeaderIndices={[0]}
              contentContainerStyle={{marginTop:windowHeight+20,backgroundColor:'transparent'}}
              style={[styles.scrollView,{overflow:'hidden',borderRadius:12,}]}
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
