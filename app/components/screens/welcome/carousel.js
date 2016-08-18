/*
* @noflow
*/

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {Component} from "react";

import TimerMixin from 'react-timer-mixin'

import colors from '../../../utils/colors'
import Swiper from '../../controls/swiper'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import CustomSceneConfigs from '../../../utils/sceneConfigs'
import Auth from './auth'
import Analytics from '../../../utils/Analytics'


const LOGIN   = 'login';
const REGISTER = 'register'

import {MagicNumbers} from '../../../utils/DeviceConfig'

// import dismissKeysboard from 'dismissKeyboard'



var slides = [
  {
    title:' ',
    img: {uri: 'assets/logo@3x.png'},
    content:' '
  },
  {
    title: 'BROWSE',
    img: {uri:'assets/tour-browse@3x.png'},
    content: 'Find like-minded Couples and Singles.'
  },
  {
    title: 'MATCH',
    img: {uri: 'assets/tour-match@3x.png'},
    content: 'If they like you too, we\'ll connect you.'
  },
  {
    title: 'CONNECT',
    img: {uri: 'assets/tour-connect@3x.png'},
    content: 'Chat with real Couples or Singles who share your interests.'
  },
  {
    title: 'PRIVATE & DISCREET',
    img: {uri: 'assets/tour-privacy@3x.png'},
    content: 'Protect your identity. Easily block friends and family.'
  },

];



class Carousel extends Component{
  constructor(props){
    super()
    this.state = {
      slides,
      offset:0,
      index:0
    }
  }
  render(){
    const {slides} = this.state
    const l = slides.length
    const welcomeSlides = [...slides,...slides].map( (slide,i) => {
      return (
        <View key={i+'slide'+i%l} style={[styles.slide,]} >
        <Image style={ {
            marginBottom:25,
            height: MagicNumbers.is4s ? 150 : DeviceHeight/3 + MagicNumbers.screenPadding,
            paddingTop: 20,
            marginTop: i%l == 0 ? MagicNumbers.screenPadding*1.8 : MagicNumbers.screenPadding,
            width: i%l == 0 ? MagicNumbers.screenWidth : MagicNumbers.screenPadding*5
          } } source={slide.img} defaultSource={slide.img} resizeMode={Image.resizeMode.contain}/>
          <View style={[styles.textwrap,{marginBottom:5}]}><Text style={[styles.textplain,
          {
            fontFamily:'Montserrat',
            fontWeight:'700',
            marginTop:15,
            fontSize: MagicNumbers.is4s ? 18 : 22,
          }
          ]}>{slide.title}</Text></View>

        {slide.content &&  <View style={styles.textwrap}><Text style={[styles.textplain,{
            fontSize: MagicNumbers.is5orless ? 18 : 22,
          }]}>{slide.content}</Text></View>}
        </View>
      )
    })

    //         dot={<View style={styles.dot} />}
              // activeDot={<View style={[styles.dot,styles.activeDot]} />}

    return (
        <View collapsable={true}>
        <ScrollView
          onScroll={(e)=>{
            let off = e.nativeEvent.contentOffset.x;
            if(off%DeviceWidth > 0){ return false }
            if(off < this.state.offset){
              if(off < 0){
                off = e.nativeEvent.contentOffset.x + DeviceWidth*5
              }
            }else{
              if(off >= DeviceWidth*this.state.slides.length){
                off = e.nativeEvent.contentOffset.x - DeviceWidth*5
              }
            }
            this.setState({
              offset: off,
              index: parseInt(off/DeviceWidth)
            })
          }}
          style={[styles.carousel,{}]}
          horizontal={true}
          pagingEnabled={ true}
          scrollEventThrottle={DeviceWidth*5}
          showsHorizontalScrollIndicator={ false}
          showsVerticalScrollIndicator={ false}
          scrollsToTop={false}
          contentOffset={{x:this.state.offset,y:0}}
          removeClippedSubviews={true}
          grayDots={true}
          contentContainerStyle={{
            alignItems:'center',
            justifyContent:'center',
            alignSelf:'stretch',
          }}
          style={{
            height:DeviceHeight-80
          }}
         >
        {welcomeSlides}
      </ScrollView>

      <View pointerEvents='none' style={{
          position: 'absolute',
          bottom: MagicNumbers.screenPadding/2,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'}}>
        {this.state.slides.map((s,i) => <View key={i+'dots'} style={[styles.dot,this.state.index == i ? styles.activeDot : null]} />)}
      </View>
      </View>

    )
  }
}

Carousel.displayName = 'Carousel';

export default Carousel

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    borderWidth: 2,

    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.mediumPurple,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  textplain:{
    color: colors.white,
    alignSelf:'center',
    fontSize:22,
    fontFamily:'omnes',
    textAlign:'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'Montserrat'
  },
  carousel:{
    marginTop:50,
    width: DeviceWidth,
    height:DeviceHeight-150,

  },
  slide:{
    width: DeviceWidth,
    flexDirection:'column',
    height:DeviceHeight-150,
    justifyContent:'flex-start',
    alignItems:'center',
    padding:MagicNumbers.screenPadding/2
  },


  textwrap:{
    alignItems:'center',
    height:50,
    justifyContent:'center',
  },

  // dot: {
  //   backgroundColor: colors.shuttleGray,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderColor: colors.shuttleGray
  // },
  // activeDot: {
  //   backgroundColor: colors.mediumPurple20,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderWidth: 2,
  //   borderColor: colors.mediumPurple
  // }
});
