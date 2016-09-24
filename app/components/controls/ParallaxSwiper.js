
import React from "react";
import {StyleSheet, View, ScrollView, Animated, Dimensions,TouchableOpacity,Image} from "react-native";
import colors from '../../utils/colors'
import {BlurView,VibrancyView} from 'react-native-blur';
const screen = Dimensions.get('window');
const ScrollViewPropTypes = ScrollView.propTypes;
const DeviceWidth = screen.width
const DeviceHeight = screen.height
import XButton from '../buttons/XButton'
import Swiper from './swiper'

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

        if(!this.state.wasKilled && e.value <= -100){
            this.state.scrollY.removeListener(this.maybeKillProfile.bind(this))
            this.setState({wasKilled: true})
            this.killProfile()
        }
    }

    killProfile(){
        this._scrollView.scrollTo({x:0,y:0,animated:true})

        this.props.killProfile && this.props.killProfile()
        this.setState({wasKilled: false})
    }
    renderBackground() {
        let { windowHeight, slideFrames, blur,profileVisible,isTopCard } = this.props;
        let { scrollY } = this.state;
    // if (!windowHeight || !swiper) {
    //   return null;
    // }
        const slides = slideFrames.map((p,i) => {

            let {image_url} = p;
            if(!image_url || image_url.length == 0){ image_url = 'assets/placeholderUser@3x.png'}
            else{
                image_url = image_url.replace('test/','').replace('images/','')
            }

            return (
        <Image
            source={{uri: image_url || 'assets/defaultuser.png' }}
            key={`${p.id}slide${i}`}
            resizeMode="cover"
            style={{flex:10,
            alignItems:'center',
            width:this.props.cardWidth,
            justifyContent:'center',
            flexDirection:'column',
            backgroundColor:colors.darkPurple,
            marginLeft:profileVisible ? 0 : -40
          }}
        />
      )
        });
        windowHeight = screen.height;

        // console.log(this.props.pan,this.props.isTopCard);
        return (
              <Animated.View
                  style={[styles.background, {
                      shadowColor: colors.darkShadow,
                      shadowOpacity: 0.4,
                      shadowRadius: 30,
                      shadowOffset: {
                          width:0,
                          height: -10
                      },
                      borderRadius:11,
                      overflow:'visible',
                      backgroundColor:  this.props.pan && this.props.isTopCard ? this.props.pan.x.interpolate({
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
                      }) : 'white', }]}

              >
                  <View style={{overflow:'hidden',borderRadius:11,width:DeviceWidth}}>
                         <Swiper
                             width={this.props.cardWidth }
                             isTopCard={isTopCard}
                             profileVisible={this.props.profileVisible}
                             height={DeviceHeight }
                             horizontal={true}
                             pan={this.props.pan}
                             dispatch={this.props.dispatch}
                             scrollEnabled={true}
                             profileVisible={this.props.profileVisible}
                             inCard={true}
                             paginationStyle={ {
                                 bottom:140,
                                 backgroundColor:'transparent',
                                 position:'absolute',
                                 right:0
                             }}
                         >
                            {slides}
                        </Swiper>
                  </View>

                                 {/* <Animated.View style={{
                                     backgroundColor:colors.shuttleGray,
                                     height:44,
                                     top:0,
                                     zIndex:70,
                                     transform: [
                                         {
                                             translateY: this.state.scrollY.interpolate({
                                                 inputRange: [0,DeviceHeight],
                                                 outputRange: [-50,10]
                                             })
                                         }
                                     ],
                                     position:'absolute',
                                     width:DeviceWidth
                                 }}/> */}
            </Animated.View>
        );
    }


    render() {
        let { style,windowHeight,swiper, ...props } = this.props;
        return (
          <View style={[styles.container, style, {top:-20}]}>
              <ScrollView
                  {...props}
                  automaticallyAdjustContentInsets={false}
                  ref={component => { this._scrollView = component; }}
                  stickyHeaderIndices={[0]}
                  contentContainerStyle={{marginTop:windowHeight,backgroundColor:'transparent'}}
                  style={[styles.scrollView,{overflow:'hidden',borderRadius:11,top:20,
                  marginBottom:-500}]}
                  onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                  )}
                  scrollEventThrottle={16}
                  onScrollAnimationEnd={()=>{}}
              >
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
        position:'relative',
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
