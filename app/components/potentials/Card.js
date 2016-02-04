/* @flow */
// ISSUES:
// setting centerContent=true on a scrollview changes the entire layout system
// cards are scaled and can safely be left at dw/dh ?

import React, {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native'

import SliderTabBar from './SliderTabBar'
import animations from './LayoutAnimations'
import styles from './styles'
import ReportModal from '../../modals/ReportModal';
import FakeNavBar from '../../controls/FakeNavBar';
import ScrollableTabView from '../../scrollable-tab-view'
import Mixpanel from '../../utils/mixpanel';
import colors from '../../utils/colors';
import Swiper from '../../controls/swiper';
import ProfileTable from '../ProfileTable';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'
import scrollable from 'react-native-scrollable-decorator'
import UserDetails from '../../UserDetails'
import reactMixin from 'react-mixin'

const cardSizeMap = {

}

// @scrollable
class Card extends React.Component{

  static defaultProps = {
    profileVisible: false
  };

  constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }
  }
  componentDidUpdate(pProps,pState){
    if(pProps.profileVisible != this.props.profileVisible ){
      this.refs.scrollbox && this.refs.scrollbox.setNativeProps({contentOffset:{x:0,y:0}})
    }
  }

  setNativeProps(np){
    this.refs.incard && this.refs.incard.setNativeProps(np)
  }
  // componentWillMount(){
  //   this.props.pan && this.props.isTopCard && this.valueListener()
  // }
  openProfileFromImage(e){
    if(!this.props.animatedIn){ return }
    this.setState({activeIndex: this.state.activeIndex + 1})
    this.props.toggleProfile()
  }

  componentWillReceiveProps(nProps){
    if(nProps && nProps.pan && this.props.profileVisible != nProps.profileVisible){
      LayoutAnimation.configureNext(animations.layout.spring);
      this.toggleCardHoverOff()

    }
  }

  toggleCardHoverOn(){
    if(!this.props.animatedIn){ return }

    this.refs.cardinside.setNativeProps({
      style: { shadowColor: colors.darkShadow, shadowRadius:30, shadowOpacity: 1 }
    })

  }
  toggleCardHoverOff(){
    if(!this.props.animatedIn){ return }

    this.refs.cardinside.setNativeProps({
      style: { shadowColor: colors.darkShadow, shadowRadius:0, shadowOpacity: 0  }
    })
  }

  reportModal(){

     this.props.navigator.push({
      component: ReportModal,
      passProps: {
        action: 'report',
        potential: this.props.potential,
        goBack: ()=> {
          this.props.navigator.pop()
        }
      }
    })
  }

  render(){

    const potential = this.props.potential || {user:{}};
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null]

    if(potential.partner && potential.partner.firstname){
      names.push(potential.partner.firstname.trim())
    }

    const { rel,  profileVisible, isTopCard, isThirdCard, pan } = this.props;
    let matchName = names[0],
        distance = potential.user.distance || ``,
        city = potential.user.city_state || ``;

    if(rel == 'single') {
      matchName += ' & ' + names[1]
      distance = Math.min(distance,potential.partner && potential.partner.distance || '666666666')
    }

    return (
      <View
        shouldRasterizeIOS={!this.props.animatedIn}
        ref={'cardinside'} key={`${potential.id || potential.user.id}-inside`}
        style={ profileVisible ? cs.cardinsideOPEN : cs.cardinsideCLOSED }>

          <ScrollView
          scrollEnabled={profileVisible}
          ref={'scrollbox'}
          centerContent={false}
          alwaysBounceHorizontal={false}
          horizontal={false}
          removeClippedSubviews={true}

            contentOffset={{x:0,y:0}}
            style={[styles.card,
             profileVisible ? cs.scrollboxOPEN : cs.scrollboxCLOSED
           ]} key={`${potential.id || potential.user.id}-view`}>

              <Animated.View
                key={`${potential.id || potential.user.id}bgopacity`}
                ref={isTopCard ? 'incard' : null}
                pointerEvents="box-none"
                style={[profileVisible ? null : cs.bgopacityCLOSED, {

                  backgroundColor: isTopCard ? this.props.pan && this.props.pan.x.interpolate({
                    inputRange: [-300,-50, -40, 0, 40,  50, 300],
                    outputRange: [
                      'rgb(232,74,107)',
                      'rgb(232,74,107)',
                      'rgb(255,255,255)',
                      'rgb(255,255,255)',
                      'rgb(255,255,255)',
                      'rgb(66,181,125)',
                      'rgb(66,181,125)' ],
                  }) : colors.white,
                }]}
                >
                {this.props.user.relationship_status == 'single' ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  style={ profileVisible ? cs.swiperOPEN : cs.swiperCLOSED}
                  showsPagination={true}
                  paginationStyle={cs.swiperPagination}
                  >

                  <TouchableOpacity
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg, profileVisible ? null : cs.touchableimgCLOSED]}
                    onPressIn={this.toggleCardHoverOn.bind(this)}
                    onPressOut={this.toggleCardHoverOff.bind(this)}
                    onPress={this.openProfileFromImage.bind(this)}
                  >
                  <Animated.Image
                  source={potential.user.image_url ? {uri:potential.user.image_url} : {uri: 'assets/defaultuser.png'}}
                    key={`${potential.user.id}-cimg`}
                    defaultSource={{uri: 'assets/defaultuser.png'}}
                    style={[styles.imagebg, profileVisible ? cs.cimgOPEN : cs.cimgCLOSED, {

                      opacity: isTopCard && pan ? pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                  </TouchableOpacity>

                  {potential.partner &&

                  <TouchableOpacity
                    key={`${potential.partner.id}-touchableimg`}
                    style={[styles.imagebg,{height:undefined, width: undefined,}]}
                    onPressIn={this.toggleCardHoverOn.bind(this)}
                    onPressOut={this.toggleCardHoverOff.bind(this)}
                    onPress={this.openProfileFromImage.bind(this)}
                    >
                    <Animated.Image
                    source={potential.partner.image_url ? {uri:potential.user.image_url} : {uri: 'assets/defaultuser.png'}}
                      key={`${potential.partner.id}-cimg`}
                      defaultSource={{uri: 'assets/defaultuser.png'}}
                      style={[styles.imagebg, profileVisible ? cs.cimgOPEN : cs.cimgCLOSED, {
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                            outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </TouchableOpacity>
                }
                { potential.partner && potential.image && potential.image != null && potential.image != '' ?
                    <TouchableOpacity
                      key={`${potential.couple.id}-touchableimg`}
                      style={[styles.imagebg,{ height:undefined, width: undefined,}]}
                      onPress={this.openProfileFromImage.bind(this)}
                      >
                      <Animated.Image
                        source={{uri: potential.image}}
                        key={`${potential.partner.id}-cimg`}
                        style={[styles.imagebg, profileVisible ? cs.cimgOPEN : cs.cimgCLOSED, {
                          opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                    </TouchableOpacity> : null
                  }

                </Swiper> :
                  <View style={swiperAlt}>
                  <TouchableOpacity
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{
                  width:undefined,
                    minHeight:DeviceHeight-50
                  }]}
                  onPressIn={this.toggleCardHoverOn.bind(this)}
                  onPressOut={this.toggleCardHoverOff.bind(this)}
                  onPress={this.openProfileFromImage.bind(this)}
                  >
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    defaultSource={{uri: 'assets/defaultuser.png'}}
                    style={[styles.imagebg, profileVisible ? cs.cimgOPEN : cs.cimgCLOSED, {
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                      }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                </TouchableOpacity>
              </View>
                }


            <View
              key={`${potential.id || potential.user.id}-bottomview`}
              style={profileVisible ? [cs.bottomviewOPEN] : [cs.bottomviewCLOSED,{
                height:80,
                marginTop: isTopCard ? -10 : -25,
              }]}
              >
            <View
              key={`${potential.id || potential.user.id}-infos`}
              style={{
                padding: isTopCard ? 10 : 5,
                paddingTop:MagicNumbers.is4s ? 20 : 15,
                paddingBottom:MagicNumbers.is4s ? 10 : 15,
                height:80,width:undefined,
                minWidth:DeviceWidth-40,
                bottom:0,
                alignSelf:'center',flexDirection:'column',
              position:'relative',top:0,}}>
                  <Text style={[styles.cardBottomText,{}]}
                    key={`${potential.id || potential.user.id}-names`}>{
                      matchName
                    }</Text>
                    <Text style={[styles.cardBottomOtherText,{flex:1}]}
                    key={`${potential.id || potential.user.id}-matchn`}>{
                      `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                    }</Text>
                </View>

            {this.props.rel == 'single' && isTopCard ?

              <View style={{
                height:74,
                top:MagicNumbers.is4s ? -55 : -45,
                right:5,
                alignSelf:'flex-end',
                position:'absolute',
                padding:5,
                alignItems:'flex-end',
                backgroundColor:'transparent',
                flexDirection:'row'}}>
                <TouchableHighlight onPress={this.openProfileFromImage.bind(this)}
                underlayColor={colors.mediumPurple} style={styles.circleimagewrap}>
                  <Image
                    source={{uri: this.props.potential.user.image_url}}
                    key={this.props.potential.user.id + 'img'}
                    style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller), {
                      marginRight:0,
                      opacity: this.state.activeIndex == 1 ? 1 : 0.9
                    }]}
                  />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.openProfileFromImage.bind(this) }
                underlayColor={colors.mediumPurple} style={styles.circleimagewrap}>
                          <Image
                    source={{uri: this.props.potential.partner.image_url}}
                    key={this.props.potential.partner.id + 'img'}
                    style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller),{
                      opacity: this.state.activeIndex == 1 ? 1 : 0.9
                    }]}
                  />
                </TouchableHighlight>
                </View> : null
              }



          { profileVisible ? <View style={{top:0}}>

                  {potential.bio && potential.user.bio &&
                    <View style={{margin:MagicNumbers.screenPadding/2}}>
                      <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                          rel =='single' ? `About Me` : `About Us`
                      }</Text>
                      <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                          potential.bio || potential.user.bio
                      }</Text>
                    </View>
                  }

                  <View style={{ paddingVertical:20,alignItems:'stretch' }}>
                    <UserDetails potential={potential} user={this.props.user} location={'card'} />
                  </View>

                  <TouchableOpacity onPress={this.reportModal.bind(this)}>
                    <View style={{flex:1,marginTop:20,paddingBottom:50}}>
                      <Text style={{color:colors.mandy,textAlign:'center'}}>Report or Block this user</Text>
                    </View>
                  </TouchableOpacity>

                </View> : null}
              </View>
            </Animated.View>

          </ScrollView>

        {profileVisible ?        <View
                  key={'navbarholder'}
                  style={{
                    backgroundColor:'black',
                    flex:1,
                    width: DeviceWidth,
                    position:'absolute',
                    top:0,height:55,overflow:'hidden'
                  }}
                ><View style={{backgroundColor:'#000',top:0,width:DeviceWidth,height:55,}}>
            <FakeNavBar
              hideNext={true}
              backgroundStyle={{
                backgroundColor:'black',
                width:DeviceWidth,
                height:55,
              }}
              insideStyle={{
                flex:1,
                width:DeviceWidth,
                height:50,marginTop:5,
                backgroundColor:colors.outerSpace,
                borderTopLeftRadius:8,
                borderTopRightRadius:8,
                overflow:'hidden',
              }}
              titleColor={colors.white}
              title={ matchName }
              onPrev={(nav,route)=> {this.props.toggleProfile()}}
              customPrev={
                <Image
                resizeMode={Image.resizeMode.contain}
                style={{margin:0,alignItems:'flex-start',height:12,width:12,marginTop:10}}
                source={{uri: 'assets/close@3x.png'}}
                />
              }
            /></View>

        </View> : null}
        </View>

    )


  }
}

reactMixin.onClass(Card,scrollable)
export default Card

const cs = StyleSheet.create({
  cardinsideOPEN: {
      width:DeviceWidth,
      right:0,
      left:-20,
      alignItems:'flex-start',

      top:0,
      alignSelf:'stretch',
      flex:1
  },

  cardinsideCLOSED:{
    borderRadius: 8,
    flex:1,
    width:undefined,
    position:'relative',
    height:DeviceHeight-50,
    overflow:'hidden',
    backgroundColor:colors.dark
  },

  scrollboxContainerCLOSED:{
    alignItems:'center',
      justifyContent:'center',
      position:'relative',
      width:undefined,
      height:undefined,
      left:0,
      right:0,
      flex:1,
    },



    scrollboxCLOSED:{
      margin:0,
      padding:0,
      width:undefined,
      // left:0,right:0,
      padding: 0,
      paddingTop: 0,
      height:undefined,
      position:'relative',
      flex:1,
      backgroundColor: colors.white,
   },


     scrollboxOPEN:{
       margin:0,
       width:DeviceWidth,
       paddingTop:55,
       top:0,
       left:0,
       bottom:0,
       position:'relative',
       right:0,
       backgroundColor:'black',
       height:DeviceHeight,
       flex:1,
     },



  bgopacityCLOSED:   {
    flex:1,
    alignItems:'center',
    justifyContent:'center',left:0,right:0,
    marginHorizontal:0,
    flexDirection:'column',
    position:'relative',
  },
swiperOPEN: {
    width: DeviceWidth,
    flex:1,
top:0
  },

  swiperCLOSED: {
    alignSelf: 'center',
    marginLeft: 0,
    // overflow:'hidden',
    height: undefined,
    width: undefined,
    marginRight: 0,
    left: 0,    flex:1,
    top:0


  },

  swiperPagination: {
    position: 'absolute',
    paddingRight: 35,
    right: 0,
    top: 45,
    height: 100
  },


  touchableimgCLOSED: {
    overflow: 'hidden',
    height: undefined,
    width: undefined,
  },

  cimgCLOSED: {
    backgroundColor: colors.white,
    width: undefined,
    height: undefined,
    flex: 1,
    left: 0,
    right: 0,
    top:0
  },

  cimgOPEN: {
    width: DeviceWidth,
  },

  swiperAltCLOSED: {
    alignSelf: 'center',
    marginLeft: 0,
    // overflow:'hidden',
    height: undefined,
    width: undefined,
    marginRight: 0,
    flex: 1,
    left: 0,
    alignItems: 'stretch'
  },


  bottomviewCLOSED: {
    flex: 1,
    left: 20,
    bottom: 80,
    backgroundColor: colors.white,
    width: undefined,


    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'stretch',
    alignItems: 'stretch'

  },

  bottomviewOPEN: {
    minHeight: 200,
    top: 0,
    marginTop: ( DeviceHeight <= 568 ? -120 : -320 ),
    backgroundColor: colors.outerSpace,
    flex: 1,
    left: 0,
    right: 0,
position:'relative',
    width: undefined,
  }
} )
