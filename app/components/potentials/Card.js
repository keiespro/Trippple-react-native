/* @flow */
// ISSUES:
// setting centerContent=true on a scrollview changes the entire layout system
// cards are scaled and can safely be left at dw/dh ?

import React from "react";

import {StyleSheet, Text, View, LayoutAnimation, Image, TouchableOpacity, TouchableHighlight, Animated, ScrollView, Dimensions} from "react-native";

import SliderTabBar from './SliderTabBar'
import animations from './LayoutAnimations'
import styles from './styles'
import ReportModal from '../../modals/ReportModal';
import FakeNavBar from '../../controls/FakeNavBar';
import ScrollableTabView from '../../scrollable-tab-view'
import Mixpanel from '../../utils/mixpanel';
import colors from '../../utils/colors';
import Swiper from 'react-native-swiper';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'

import UserDetails from '../../UserDetails'
import reactMixin from 'react-mixin'
import MatchActions from '../../flux/actions/MatchActions'
import Analytics from '../../utils/Analytics'



class Card extends React.Component{

  static defaultProps = {
    profileVisible: false
  };

  constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }

    __DEV__ && props.isTopCard && console.log('POTENTIAL CARD:');
    __DEV__ && props.isTopCard && console.table(props.potential);

  }

  getInnerViewNode(): any {
    return this.getScrollResponder().getInnerViewNode();
  }

  scrollTo(destY?: number, destX?: number) {
    this.getScrollResponder().scrollTo({y:destY, x:destX});
  }

  scrollWithoutAnimationTo(destY?: number, destX?: number) {
    this.getScrollResponder().scrollWithoutAnimationTo(destY, destX);
  }

  componentDidUpdate(pProps,pState){
    if(pProps.profileVisible != this.props.profileVisible ){
      this.refs.scrollbox && this.refs.scrollbox.setNativeProps({contentOffset:{x:0,y:0}})
    }
  }

  setNativeProps(np){
    this.refs.incard && this.refs.incard.setNativeProps(np)
  }
  componentDidMount(){
    this.checkPotentialSuitability();
  }
  openProfileFromImage(e){
    if(!this.props.animatedIn || !this.props.isTopCard){ return }
    this.setState({activeIndex: this.state.activeIndex + 1})
    if(this.props.profileVisible){
      this.props.toggleProfile(this.props.potential)

    }else{
      this.props.showProfile(this.props.potential)
    }
  }

  componentWillReceiveProps(nProps){
    if(nProps && nProps.pan && this.props.profileVisible != nProps.profileVisible){
      LayoutAnimation.configureNext(animations.layout.spring);
      // this.toggleCardHoverOff()
    }
    if(nProps.potential.user.id != this.props.potential.user.id){
      __DEV__ && nProps.isTopCard && console.table(nProps.potential)
      this.checkPotentialSuitability();

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
        goBack: (them)=> {
          this.props.navigator.pop();
          if(them){
            MatchActions.removePotential.defer(them.id);
            MatchActions.sendLike.defer(
              them.id, 'deny', (this.props.rel == 'single' ? 'couple' : 'single'), this.props.rel
            );
            this.props.toggleProfile()
          }
        }
      }
    })
  }

  checkPotentialSuitability(){
    if(this.props.user && this.props.user.relationship_status == 'single' && this.props.potential && this.props.potential.partner && this.props.potential.partner.id == ""){

        Analytics.warning(`CHECK POTENTIALS RESPONSE!`, `Your relationship_status is ${this.props.user.relationship_status}, but potential card is not a couple.`);

      // Analytics.err({message: `Possibly broken potential card delivered to user ${this.props.user.id}`})

    }
  }
  render(){

    const potential = this.props.potential || {user:{}};
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null]

    if(potential.partner && potential.partner.firstname){
      names.push(potential.partner.firstname.trim())
    }

    var { rel,  profileVisible, isTopCard, isThirdCard, pan } = this.props,
      matchName = names[0],
      distance = potential.user.distance || ``,
      city = potential.user.city_state || ``;

    if(rel == 'single') {
      matchName += ' & ' + names[1]
      distance = Math.min(distance,potential.partner && potential.partner.distance || '666666666')
    }


    if(!profileVisible){
      const heights = {
        smallest:{
          top: -60,
          second: -57,
          third: -55
        },
        middle:{
          top: -65,
          second: -55,
          third: -50
        },
        all:{
          top: -50,
          second: -57,
          third: -60
        }
      };

      var heightTable =  MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
      var cardHeight = DeviceHeight + (isTopCard ? heightTable.top : (isThirdCard ? heightTable.third : heightTable.second));
      // ? DeviceHeight- 40 : DeviceHeight -60

      return (
        <View
          shouldRasterizeIOS={!this.props.animatedIn}
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={ [{
            borderRadius: 8,
            flex:1,
            width:undefined,
            position:'relative',
            height: cardHeight,
            overflow:'hidden',
            backgroundColor:'black',
          } ]}
        >

          <ScrollView
            scrollEnabled={false}
            ref={'scrollbox'}
            centerContent={false}
            alwaysBounceHorizontal={false}
            horizontal={false}
            removeClippedSubviews={true}
            canCancelContentTouches={false}
            contentContainerStyle={{
              alignItems:'center',
              justifyContent:'center',
              position:'relative',
              width:undefined,
              height:undefined,
              left:0,
              right:0,
              flex:1,
              overflow:'hidden',

            }}
            contentOffset={{x:0,y:0}}
            style={[styles.card, {
              margin:0,
              padding:0,
              width: undefined,
              height: undefined,
              position: 'relative',
              flex:1,
              backgroundColor: colors.white
            }]}
            key={`${potential.id || potential.user.id}-view`}
          >

            <Animated.View
              key={`${potential.id || potential.user.id}bgopacity`}
              ref={isTopCard ? 'incard' : null}
              style={{
                flex:1,
                alignItems:'center',
                justifyContent:'center',
                left:0,
                right:0,
                marginHorizontal:0,
                flexDirection:'column',
                position:'relative',
                backgroundColor: isTopCard ? this.props.pan && this.props.pan.x.interpolate({
                  inputRange: [-300,-30, -10, 0, 10,  30, 300],
                  outputRange: [
                    'rgb(232,74,107)',
                    'rgb(232,74,107)',
                    'rgb(255,255,255)',
                    'rgb(255,255,255)',
                    'rgb(255,255,255)',
                    'rgb(66,181,125)',
                    'rgb(66,181,125)'
                  ],
                }) : colors.white,
              }}
            >
              {this.props.user.relationship_status == 'single' ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  style={{
                    alignSelf:'center',
                    marginLeft:0,
                    height:undefined,width:undefined,
                    marginRight:0,
                    left:0,
                  }}
                  showsPagination={true}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot,styles.activeDot]} />}

                  paginationStyle={{position:'absolute',paddingRight:30,right:0,top:45,height:100}}
                >

                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{ overflow:'hidden',height:undefined, width: undefined,}]}
                    onPressIn={this.toggleCardHoverOn.bind(this)}
                    onPressOut={this.toggleCardHoverOff.bind(this)}
                    onPress={this.openProfileFromImage.bind(this)}
                  >
                    <Animated.Image
                      source={ {uri:potential.user.image_url}}
                      key={`${potential.user.id}-cimg`}
                      defaultSource={{uri: 'assets/defaultuser.png'}}
                      style={[styles.imagebg, {
                        backgroundColor: colors.white,
                        width: undefined,
                        height:undefined,
                        flex:1,
                        left:0,
                        right:0,
                        opacity: isTopCard && pan ? pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                </TouchableHighlight>

                  {potential.partner &&

                    <TouchableHighlight
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.partner.id}-touchableimg`}
                      style={[styles.imagebg,{height:undefined, width: undefined,}]}
                      onPressIn={this.toggleCardHoverOn.bind(this)}
                      onPressOut={this.toggleCardHoverOff.bind(this)}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={{uri:potential.partner.image_url}}
                        key={`${potential.partner.id}-cimg`}
                        defaultSource={{uri: 'assets/defaultuser.png'}}
                        style={[styles.imagebg,{
                          backgroundColor: colors.white,
                          flex:1,
                          height:undefined,
                          width: undefined,
                          opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange:  [-300, -80, 0, 80, 300],
                            outputRange: [   0,   1, 1,  1,   0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                  </TouchableHighlight>
                  }
                  {/*{ false &&  potential.couple && potential.partner && potential.image && potential.image != null && potential.image != '' ?
                    <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.id}-touchableimg`}
                      style={[styles.imagebg,{ height:undefined, width: undefined,}]}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={{uri: potential.image}}
                        defaultSource={{uri: 'assets/defaultuser.png'}}
                        key={`${potential.id}-cimg`}
                        style={[styles.imagebg,{
                          width: undefined,
                          height:undefined,
                          flex:1,
                          opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                    </TouchableHighlight> : null
                  }*/}

                </Swiper> :
                <View style={{
                  alignSelf:'center',
                  marginLeft:0,
                  // overflow:'hidden',
                  height:undefined,width:undefined,
                  marginRight:0,flex:1,
                  left:0,alignItems:'stretch'
                }}
                >
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{
                      width:undefined,
                      height:DeviceHeight-50
                    }]}
                    onPress={this.openProfileFromImage.bind(this)}>
                    <Animated.Image
                      source={{uri: this.props.potential.user.image_url}}
                      key={`${potential.user.id}-cimg`}
                      defaultSource={{uri: 'assets/defaultuser.png'}}
                      style={[styles.imagebg,{
                        backgroundColor: colors.white,
                        flex:1,width:DeviceWidth, height:DeviceHeight,
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                </TouchableHighlight>
                </View>
                  }


              <View
                key={`${potential.id || potential.user.id}-bottomview`}
                style={{
                  height: isTopCard ? 80 : 70,
                  marginTop: isTopCard ? -10 : -30,
                  flex:1,
                  marginLeft:20,
                  right:0,
                  left:0,
                  bottom:0,
                  backgroundColor:colors.white,
                  width:DeviceWidth-MagicNumbers.screenPadding/2,
                  flexDirection:'row',
                  position:'absolute',
                  alignSelf:'stretch',alignItems:'stretch'
                  // marginRight: this.props.profileVisible ? 0 : 50,
                }}
              >
              <TouchableHighlight
                underlayColor={colors.mediumPurple} underlayColor={colors.warmGrey} onPress={this.openProfileFromImage.bind(this)}>

                <View
                  key={`${potential.id || potential.user.id}-infos`}
                  style={{
                    padding: isTopCard ? 10 : 15,
                    paddingTop:MagicNumbers.is4s ? 20 : 15,
                    paddingBottom:MagicNumbers.is4s ? 10 : 15,
                    height:80,
                    width:DeviceWidth-MagicNumbers.screenPadding/2,
                    bottom:0,flex:1,
                    alignSelf:'stretch',
                    flexDirection:'column',
                    position:'relative',top:0,
                  }}
                >
                  <Text style={[styles.cardBottomText,{}]}
                    key={`${potential.id || potential.user.id}-names`}>{
                      matchName
                    }</Text>
                    {/*<Text style={[styles.cardBottomOtherText,{flex:1}]}
                    key={`${potential.id || potential.user.id}-matchn`}>{
                      `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                    }</Text>*/}
                </View>
                </TouchableHighlight>

              {this.props.rel == 'single'  ?

                <View style={{
                  height:74,
                  top:MagicNumbers.is4s ? -55 : -45,
                  right:15,
                  alignSelf:'flex-end',
                  position:'absolute',
                  padding:5,
                  alignItems:'flex-end',
                  backgroundColor:'transparent',
                  flexDirection:'row'}}
                >
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple} onPress={this.openProfileFromImage.bind(this)}
                    underlayColor={colors.mediumPurple} style={styles.circleimagewrap}
                  >
                    <Image
                      source={{uri: this.props.potential.user.image_url}}
                      key={this.props.potential.user.id + 'img'}
                      style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller), {
                        marginRight:0,
                        opacity: this.state.activeIndex == 1 ? 1 : 0.9
                      }]}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple} onPress={this.openProfileFromImage.bind(this) }
                    underlayColor={colors.mediumPurple} style={styles.circleimagewrap}
                  >
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

              </View>
            </Animated.View>

            {isTopCard ? // DENY ICON
              <Animated.View key={'denyicon'} style={[styles.animatedIcon,{

                transform: [
                  {
                    scale: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [-DeviceWidth,-DeviceWidth/3,-50,0],
                      outputRange: [2.4,2.4,0,0]
                    }) : 0
                  },{
                    translateY: this.props.pan ? this.props.pan.y.interpolate({
                      inputRange: [0, DeviceWidth/3],
                      outputRange: [0,10]
                    }) : 0
                  },{
                    translateX: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [-DeviceWidth,-DeviceWidth/3, 50],
                      outputRange: [0,(20),100]
                    }) : 0
                  }
                ],

                      // transform: [
                //   {
                //     scale: this.props.pan ? this.props.pan.x.interpolate({
                //       inputRange: [-DeviceWidth/2,-50,0], outputRange: [2,0.5,0]}) : 0
                //   },
                //   {
                //     translateX: this.props.pan ? this.props.pan.x.interpolate({
                //       inputRange: [-DeviceWidth/3,0],
                //       outputRange: [50,40]
                //     }) : 0
                //   },
                //   {
                //     translateY: this.props.pan ? this.props.pan.y.interpolate({
                //       inputRange: [0,0,DeviceHeight,DeviceHeight],
                //       outputRange: [(DeviceHeight/2)-10,(DeviceHeight/2),DeviceHeight/2+10,DeviceHeight/2+100]
                //     }) : 0
                //   }
                // ],
              marginLeft: 0

              }]}
              >
                <Image
                  source={{uri: 'assets/iconDeny@3x.png'}}
                  style={{
                    backgroundColor:'transparent',
                    width:60,
                    height:60,
                    paddingLeft:0
                  }}
                />
              </Animated.View> : null }

            {isTopCard  ? // APPROVE ICON
              <Animated.View key={'approveicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange:   [0,0,50,DeviceWidth/2,DeviceWidth],
                      outputRange:  [0,0,0,1.7,1.7]
                    }) : 0
                  },{
                    translateY: this.props.pan ? this.props.pan.y.interpolate({
                      inputRange: [0, DeviceWidth/3],
                    outputRange: [0,10]
                    }) : 0
                  },{
                    translateX: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [0, 50, DeviceWidth/3],
                    outputRange: [0,0,0]
                    }) : 0
                  }
                ],
              }]}
              >
                <Image
                  source={{uri: 'assets/iconApprove@3x.png'}}
                  style={{backgroundColor:'transparent',width:100,height:100,
                    paddingRight:50,
                  }}
                />
              </Animated.View> : null
            }
          </ScrollView>
          <View
            key={'navbarholder'}
            style={{
              backgroundColor:'black',
              flex:1,
              width: DeviceWidth,
              position:'absolute',
              top:150
            }}
          />
        </View>

      )
    }else{

      return (
        <View
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={ {
            width:undefined,
            position: 'absolute',
            right:0,
            left:0,
            alignItems:'flex-start',
            height:DeviceHeight,
            alignSelf:'stretch',
            flex:1
          }}
        >

          <ScrollView
            style={[{
              margin:0,
              width:undefined,
              paddingTop:0,
              top:0,
              left:0,
              right:0,borderTopLeftRadius:8,borderTopRightRadius:8, overflow:'hidden',
              backgroundColor:'black',
              height:DeviceHeight,
              flex:1,

            }]}
            canCancelContentTouches={true}
            horizontal={false}
            vertical={true}
            ref={'scrollbox'}
            alwaysBounceHorizontal={false}
            scrollEnabled={true}
            contentInset={{top: 0,left: 0, bottom: 0, right: 0}}
            key={`${potential.id || potential.user.id}-view`}
          >

            <Animated.View
              key={`${potential.id || potential.user.id}bgopacity`}
              ref={"incard"}
            >

              {this.props.user.relationship_status == 'single' ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  width={undefined}
                  height={DeviceHeight}
                  style={{width:undefined, overflow: 'hidden',}}
                  paginationStyle={{position:'absolute',right:10,top:10,height:100}}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot,styles.activeDot]} />}

                >

                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{
                      width: undefined,
                    }]}
                    onPress={this.openProfileFromImage.bind(this)}
                    onPressIn={(e)=>{/* this.refs.cardinside.setNativeProps({style:{opacity:0.8}}) */}}
                  >
                    <Animated.Image
                      source={ {uri: potential.user.image_url}}
                      defaultSource={{uri: 'assets/defaultuser.png'}}

                      key={`${potential.user.id}-cimg`}
                      style={[styles.imagebg, {
                        flex:1,
                        width: undefined,
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -80, 0, 80, 300],
                          outputRange: [0,1,1,1,0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                </TouchableHighlight>

                  { potential.partner &&
                    <TouchableHighlight
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.partner.id}-touchableimg`}
                      style={[styles.imagebg,{ }]}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={ {uri: potential.partner.image_url}}
                        defaultSource={{uri: 'assets/defaultuser.png'}}
                        key={`${potential.partner.id}-cimg`}
                        style={[styles.imagebg,{
                          width: undefined,
                          flex:1,
                          opacity: this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                  </TouchableHighlight>
                  }
                  {/*{ false && potential.partner && potential.image && potential.image != null && potential.image != '' ?

                    <TouchableHighlight
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.id}-touchableimg`}
                      style={[styles.imagebg,{ }]}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={ {uri: potential.image}}
                        defaultSource={{uri: 'assets/defaultuser.png'}}
                        key={`${potential.id}-cimg`}
                        style={[styles.imagebg,{
                          width: undefined,
                          flex:1,
                          opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                  </TouchableHighlight> : null
                  }*/}

                </Swiper> :
                <View style={{
                  alignSelf:'center',
                  marginLeft:0,
                  // overflow:'hidden',
                  height:undefined,width:undefined,
                  marginRight:0,flex:1,
                  left:0,alignItems:'stretch'
                }}
                >
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
                  pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{ overflow:'hidden',width:DeviceWidth,height:DeviceHeight}]}
                  onPressIn={this.toggleCardHoverOff.bind(this)}
                  onPressOut={this.toggleCardHoverOn.bind(this)}
                  onPress={this.openProfileFromImage.bind(this)}
                >
                  <Animated.Image
                    source={{uri: potential.image_url || potential.image || potential.user.image_url}}
                     key={/* TODO: Implement sanity */  `${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      flex:1,
                      alignSelf:'stretch',height:DeviceHeight,
                      width: DeviceWidth,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                        inputRange: [-300, -80, 0, 80, 300],
                        outputRange: [0,1,1,1,0]
                      }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
              </TouchableHighlight>
              </View>
              }

              <View
                key={`${potential.id || potential.user.id}-bottomview`}
                style={{
                  height: undefined,
                  top: 0,
                  marginTop: (DeviceHeight <= 568 ? -120 : -120),
                  backgroundColor:colors.outerSpace,
                  flex:1,
                  left:0,
                  right:0,
                  marginLeft:0,
                  // bottom:-180,
                  width:DeviceWidth,
                }}
              >
              <TouchableHighlight
                underlayColor={colors.mediumPurple} onPress={() => { this.refs.scrollbox.scrollTo(DeviceHeight-200,0); }} >

                <View
                  key={`${potential.id || potential.user.id}-infos`}
                  style={{
                    // height:60,
                    // overflow:'hidden',
                    width: undefined,
                    left:0,
                   height:180,
                    marginLeft: MagicNumbers.screenPadding/2,
                    paddingVertical:20,
                  }}
                >
                  <Text
                    key={`${potential.id || potential.user.id}-names`}
                    style={[styles.cardBottomText,{color:colors.white}]}
                  >{matchName}</Text>
                {/*<Text
                  key={`${potential.id || potential.user.id}-matchn`}
                  style={[styles.cardBottomOtherText,{color:colors.white}]}
                  >
                {
                  `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                }
                </Text>*/}
              </View>
            </TouchableHighlight>

              {this.props.rel == 'single' &&
                <View style={{
                  height:60,
                  top:-30,
                  position:'absolute',
                  width:125,
                  right:MagicNumbers.screenPadding/2,
                  backgroundColor:'transparent',
                  flexDirection:'row'}}
                >
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    onPress={(e)=>{ /*this.setState({activeIndex: 0}) */
                    this.refs.scrollbox.scrollTo(0,0);
                } }
                    underlayColor={colors.mediumPurple}
                    style={[styles.circleimagewrap,{ backgroundColor:colors.outerSpace }]}
                  >
                    <Image
                      source={{uri: this.props.potential.user.image_url}}
                      key={this.props.potential.user.id + 'img'}
                      style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller), {
                        marginRight:0,
                        opacity: this.state.activeIndex == 1 ? 1 : 0.9
                      }]}
                    />
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple}
                    onPress={(e)=>{ /*this.setState({activeIndex: 1}) */
                    this.refs.scrollbox.scrollTo(0,0);
                  } }

                    underlayColor={colors.mediumPurple}
                    style={[styles.circleimagewrap, { backgroundColor:colors.outerSpace }]}
                  >
                    <Image
                      source={{uri: this.props.potential.partner.image_url}}
                      key={this.props.potential.partner.id + 'img'}
                      style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller), {
                        marginRight:0,
                        opacity: this.state.activeIndex == 1 ? 1 : 0.9
                      }]}
                    />
                  </TouchableHighlight>
                </View>
              }

                <View style={{top:-50,backgroundColor:colors.outerSpace}}>

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

                </View>
              </View>

            </Animated.View>
          </ScrollView>
          <View
            key={/* TODO: Implement sanity */  'navbarholder'+potential.user.id}
            style={{
              backgroundColor:'transparent',
              width:DeviceWidth,
              position:'absolute',
              height:55,
              top:0,
              overflow:'visible',
              borderRadius:0
            }}
          >
            <View style={{backgroundColor:'transparent'}}>
              <FakeNavBar
                hideNext={true}
                backgroundStyle={{
                  backgroundColor:'transparent',
                  width:DeviceWidth,
                  height:55,
                }}
                insideStyle={{
                  flex:1,
                  width:DeviceWidth,
                  height:55,
                  marginTop:5,
                  backgroundColor:'transparent',
                  borderTopLeftRadius:8,
                  borderTopRightRadius:8,
                  overflow:'hidden',
                }}
                titleColor={colors.white}
                onPrev={(nav,route)=> {this.props.toggleProfile()}}
                customPrev={
                  <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{margin:0,alignItems:'flex-start',height:12,width:12,marginTop:10}}
                    source={{uri: 'assets/close@3x.png'}}
                  />
                }
              />
            </View>
          </View>
        </View>

      )
    }
  }
}

// reactMixin.onClass(Card,scrollable)
export default Card
