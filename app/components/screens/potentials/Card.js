
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
;
import ScrollableTabView from '../../scrollable-tab-view'

import colors from '../../../utils/colors';
import Swiper from 'react-native-swiper';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../../utils/DeviceConfig'

import UserDetails from '../../UserDetails'
import reactMixin from 'react-mixin'

import Analytics from '../../../utils/Analytics'


import ActionMan from  '../../../actions/';


const medals = {
  bronze: 'goldenrod',
  silver: 'silver',
  gold:'gold'
};
class Card extends React.Component{

  static defaultProps = {
    profileVisible: false
  };

  constructor(props){
    super()
    this.state = {
      slideIndex: 0
    }

    // __DEV__ && props.isTopCard && console.log('POTENTIAL CARD:');
    // // __DEV__ && props.isTopCard && console.table && console.table(props.potential);
    // if( props.potential && props.potential.user && props.potential.user.image_url && props.potential.user.image_url != ''){
    //   const img = props.potential.user.image_url;
    //   console.log(img);
    //   if(img && img.length > 1) Image.prefetch(img)
    // }
    // if( props.potential && props.potential.partner && props.potential.partner.image_url && props.potential.partner.image_url != ''){
    //   const img2 = props.potential.partner.image_url;
    //   console.log(img2);
    //   if(img2 && img2.length > 1) Image.prefetch(img2)
    // }

  }
  getScrollResponder(){
    return this.refs.scrollbox
  }
  getInnerViewNode(): any {
    return this.getScrollResponder().getInnerViewNode();
  }

  scrollTo({destY, destX}) {
    this.getScrollResponder().scrollTo({y:destY, x:destX},true);
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
  openProfileFromImage(e,scroll){
    console.log(e,scroll);
    // if(!this.props.animatedIn || !this.props.isTopCard){ return }
    this.setState({activeIndex: this.state.activeIndex + 1})
    if(this.props.profileVisible){
      this.props.toggleProfile(this.props.potential)

    }else{
      this.props.showProfile(this.props.potential)
      this.props.dispatch({type:'OPEN_PROFILE'})

    }
    if(scroll){
      this.scrollTo({y: DeviceHeight*0.2,x:0},true)
    }
  }

  componentWillReceiveProps(nProps){
    if(nProps && nProps.pan && this.props.profileVisible != nProps.profileVisible){
      LayoutAnimation.configureNext(animations.layout.spring);
      // this.toggleCardHoverOff()
    }
    if(nProps.potential.user.id != this.props.potential.user.id){
      // __DEV__ && nProps.isTopCard && console.table && console.table(nProps.potential)
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

    this.props.dispatch(ActionMan.showInModal({
      component: ReportModal,
      name:'Report User Modal',
      passProps: {
        action: 'report',
        potential: this.props.potential,
        goBack: (them)=> {
          this.props.dispatch(ActionMan.killModal())
          if(them){
            // // MatchActions.removePotential.defer(them.id);
            // // MatchActions.sendLike.defer(
            //   them.id, 'deny', (this.props.rel == 'single' ? 'couple' : 'single'), this.props.rel
            // );
            this.props.toggleProfile()
          }
        }
      }
    }))
  }

  checkPotentialSuitability(){
    if(this.props.user && this.props.user.relationship_status == 'single' && this.props.potential && this.props.potential.partner && this.props.potential.partner.id == ""){

        Analytics.warning(`CHECK POTENTIALS RESPONSE!`, `Your relationship_status is ${this.props.user.relationship_status}, but potential card is not a couple.`);

      // Analytics.err({message: `Possibly broken potential card delivered to user ${this.props.user.id}`})

    }
  }

  closeProfile(){
    this.props.dispatch({type:'CLOSE_PROFILE'})

    this.props.toggleProfile()
  }

  render(){

    const potential = this.props.potential || {user:{}};
    const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null]

    if(potential.partner && potential.partner.firstname){
      names.push(potential.partner.firstname.trim())
    }

    var { rel,  profileVisible, isTopCard, isThirdCard, pan } = this.props,
      matchName = names[0],
      distance = potential.user.distance && potential.user.distance != '1 Swipe Away' ? potential.user.distance : ``,
      city = potential.user.city_state || ``;

    if(rel == 'single') {
      matchName += ' & ' + names[1]
      distance = Math.min(distance,potential.partner && potential.partner.distance != '1 Swipe Away' ? potential.partner.distane : 0)
    }
    const seperator = distance.length && city.length ? ' | ' : '';

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

      const heightTable =  MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
      const cardHeight = DeviceHeight + (isTopCard ? heightTable.top : (isThirdCard ? heightTable.third : heightTable.second));
      // ? DeviceHeight- 40 : DeviceHeight -60
      const cardWidth = DeviceWidth;

      return (
        <View
          shouldRasterizeIOS={!this.props.animatedIn}
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={ [{
            borderRadius: 8,


            position:'relative',
            height: cardHeight,
            overflow:'hidden',
          }]}
        >

          <ScrollView
            scrollEnabled={false}
            ref={'scrollbox'}
            centerContent={false}
            alwaysBounceHorizontal={false}
            horizontal={false}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            canCancelContentTouches={false}
            contentContainerStyle={{
              alignItems:'center',
              justifyContent:'center',
              position:'relative',
              height:cardHeight,
              left:0,
              right:0,
              width:cardWidth,
              overflow:'hidden',
            }}
            contentOffset={{x:0,y:0}}
            style={[styles.card, {
              margin:0,
              padding:0,
              position: 'relative',
              width:cardWidth,
              backgroundColor: colors.white
            }]}
            key={`${potential.id || potential.user.id}-view`}
          >

            <Animated.View
              key={`${potential.id || potential.user.id}bgopacity`}
              ref={isTopCard ? 'incard' : null}
              style={{

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
              {potential.user.partner_id ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  style={{
                    alignSelf:'center',
                    marginLeft:0,
                    height:undefined,
                    marginRight:0,
                    left:0,
                  }}
                  showsPagination={true}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot,styles.activeDot]} />}

                  paginationStyle={{position:'absolute',paddingRight:30,right:0,top:45,height:100}}
                >

                  <View
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{ overflow:'hidden',height:undefined, width: undefined,}]}
                  >
                    <Animated.Image
                    source={ potential.user.image_url ? {uri: potential.user.image_url} : null}
                      key={`${potential.user.id}-cimg`}
                      style={[styles.imagebg, {
                        backgroundColor: colors.white,

                        left:0,
                        right:0,
                        opacity: isTopCard && pan ? pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </View>


                </Swiper> :
                <View style={{
                  alignSelf:'center',
                  marginLeft:0,
                  // overflow:'hidden',
                  height:undefined,
                  marginRight:0,
                  left:0,alignItems:'stretch'
                }}
                >
                  <View
                    underlayColor={colors.mediumPurple}
                    pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{

                      height:DeviceHeight-50
                    }]}
                    onPress={this.openProfileFromImage.bind(this,true)}>
                    <Animated.Image
                      source={{uri: this.props.potential.user.image_url}}
                      key={`${potential.user.id}-cimg`}
                      style={[styles.imagebg,{
                        backgroundColor: colors.white,
                        width:DeviceWidth, height:DeviceHeight,
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </View>
                </View>
                  }


              <View
                key={`${potential.id || potential.user.id}-bottomview`}
                style={{
                  height: isTopCard ? 120 : 118,
                  marginTop: isTopCard ? -20 : -20,
                  marginLeft:20,
                  right:0,
                  left:0,
                  bottom:0,
                  zIndex:100,
                  backgroundColor:colors.white,
                  width:DeviceWidth-MagicNumbers.screenPadding/2,
                  flexDirection:'row',
                  position:'absolute',
                  alignSelf:'stretch',alignItems:'stretch'
                  // marginRight: this.props.profileVisible ? 0 : 50,
                }}
                >
                  <TouchableHighlight
                    underlayColor={colors.mediumPurple} underlayColor={colors.warmGrey} onPress={this.openProfileFromImage.bind(this,true)}>
                    <View style={{flexDirection:'row'}}>
                      <View
                        key={`${potential.id || potential.user.id}-infos`}
                        style={{
                          padding: isTopCard ? 15 : 15,
                          paddingTop:MagicNumbers.is4s ? 20 : 15,
                          paddingBottom:MagicNumbers.is4s ? 10 : 15,
                          height:80,
                          width:cardWidth,
                          bottom:0,
                          alignSelf:'stretch',
                          flexDirection:'column',
                          position:'relative',top:0,
                        }}
                        >
                          <Text style={[styles.cardBottomText,{}]}
                          key={`${potential.id || potential.user.id}-names`}>{
                            matchName
                          }</Text>
                        <Text style={[styles.cardBottomOtherText,{}]}
                        key={`${potential.id || potential.user.id}-matchn`}>{
                          (city) + seperator + (distance.length ? `${distance} ${distance == 1 ? 'mile' : 'miles'} away` : ``)
                        }</Text>
                    </View>
                    </View>
                </TouchableHighlight>
                {__DEV__ &&  <View style={{position:'absolute',opacity:0.5,bottom:5,right:20,borderRadius:8,height:16,width:16,alignItems:'center',justifyContent:'center',
                  backgroundColor: medals[potential.rating],borderColor:colors.dark,borderWidth:StyleSheet.hairlineWidth }}>
                      <Text style={{color:colors.dark,textAlign:'center',fontSize:18}}></Text>
                      </View>}

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
                  style={{backgroundColor:'black',width:100,height:100,
                    paddingRight:50,
                  }}
                />
              </Animated.View> : null
            }
          </ScrollView>
          <View
            key={'navbarholder'}
            style={{

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

            position: 'absolute',
            right:0,
            left:0,
            alignItems:'flex-start',
            height:DeviceHeight,
            alignSelf:'stretch',

          }}
        >

          <ScrollView
            style={[{
              margin:0,
              paddingTop:0,
              top:0,
              left:0,
              backgroundColor:colors.dark,
              right:0,
            }]}
            canCancelContentTouches={true}
            horizontal={false}
            vertical={true}
            ref={'scrollbox'}
            contentContainerStyle={{
              borderRadius:8, overflow:'hidden',
            }}
            showsVerticalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            scrollEnabled={true}
            contentInset={{top: 0,left: 0, bottom: 0, right: 0}}
            key={`${potential.id || potential.user.id}-view`}
          >

            <Animated.View
              key={`${potential.id || potential.user.id}bgopacity`}
              ref={"incard"}
              style={{
                              alignItems:'center',
                              justifyContent:'center',
                              left:0,
                              right:0,
                              marginHorizontal:0,
                              flexDirection:'column',
                              position:'relative',width:DeviceWidth,}}
            >

              {potential.partner_id ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={true}
                  activeIndex={this.state.activeIndex}
                  vertical={false}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  width={undefined}
                  height={DeviceHeight}
                  style={{ overflow: 'hidden',}}
                  paginationStyle={{position:'absolute',right:10,top:10,height:100}}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot,styles.activeDot]} />}

                >

                  <View
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{
                      width: undefined,
                    }]}
                  >
                    <Animated.Image
                      source={ potential.user.image_url ? {uri: potential.user.image_url} : null}

                      key={`${potential.user.id}-cimg`}
                      style={[styles.imagebg, {

                        width: undefined,
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -80, 0, 80, 300],
                          outputRange: [0,1,1,1,0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </View>

                  { potential.partner &&
                    <View
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.partner.id}-touchableimg`}
                      style={[styles.imagebg,{ }]}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={ potential.partner.image_url ? {uri: potential.partner.image_url} : null}
                        key={`${potential.partner.id}-cimg`}
                        style={[styles.imagebg,{
                          width: undefined,

                          opacity: this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                  </View>
                  }
                  {/*{ false && potential.partner && potential.image && potential.image != null && potential.image != '' ?

                    <View
                      underlayColor={colors.mediumPurple}
                      pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                      key={`${potential.id}-touchableimg`}
                      style={[styles.imagebg,{ }]}
                      onPress={this.openProfileFromImage.bind(this)}
                    >
                      <Animated.Image
                        source={ {uri: potential.image}}
                        key={`${potential.id}-cimg`}
                        style={[styles.imagebg,{
                          width: undefined,

                          opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange: [-300, -100, 0, 100, 300],
                            outputRange: [0,1,1,1,0]
                          }) : 1
                        }]}
                        resizeMode={Image.resizeMode.cover}
                      />
                  </View> : null
                  }*/}

                </Swiper> :
                <View style={{
                  alignSelf:'center',
                  marginLeft:0,
                  // overflow:'hidden',
flexDirection:'column',alignItems:'center',justifyContent:'center',
                    marginRight:0,
                  left:0,alignItems:'stretch'
                }}
                >
                <View
                  underlayColor={colors.mediumPurple}
                  pressRetentionOffset={{top:0,left:0,right:0,bottom:0}}
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{ overflow:'hidden',width:DeviceWidth,height:DeviceHeight}]}
                  onPress={this.openProfileFromImage.bind(this)}
                >
                  <Animated.Image
                    source={{uri: potential.image_url || potential.image || potential.user.image_url}}
                     key={/* TODO: Implement sanity */  `${potential.user.id}-cimg`}
                    style={[styles.imagebg, {

                      alignSelf:'stretch',height:DeviceHeight,
                      width: DeviceWidth,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                        inputRange: [-300, -80, 0, 80, 300],
                        outputRange: [0,1,1,1,0]
                      }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                </View>
              </View>
              }

              <View
                key={`${potential.id || potential.user.id}-bottomview`}
                style={{
                   top: 0,
                  marginTop: (DeviceHeight <= 568 ? -120 : -120),
                  backgroundColor:colors.outerSpace,
flexDirection:'column',alignItems:'center',justifyContent:'center',
                  left:0,
                  right:0,
                  marginLeft:0,
                  // bottom:-180,
                  width:DeviceWidth,
                  position:'relative'
                }}
              >
              <TouchableHighlight
                underlayColor={colors.outerSpace} onPress={() => {}} >
                <View style={{flexDirection:'column',alignItems:'center',width:DeviceWidth,justifyContent:'center',position:'relative'}}>

                <View
                  key={`${potential.id || potential.user.id}-infos`}
                  style={{
                    // height:60,
                    // overflow:'hidden',
                    width:DeviceWidth,
                    left:0,
                    height:180,
                    marginLeft: MagicNumbers.screenPadding,
                    paddingVertical:20,
                  }}
                >
                  <Text
                    key={`${potential.id || potential.user.id}-names`}
                    style={[styles.cardBottomText,{color:colors.white}]}
                  >{matchName}</Text>
                <Text
                  key={`${potential.id || potential.user.id}-matchn`}
                  style={[styles.cardBottomOtherText,{color:colors.white}]}
                  >
                {
                city + seperator + (distance.length ? `${distance} ${distance == 1 ? 'mile' : 'miles'} away` : ``)
                }
                </Text>
              </View>
              {__DEV__ && <View style={{position:'absolute',opacity:0.5,top:20,right:20,borderRadius:8,height:16,width:16,alignItems:'center',justifyContent:'center',
                backgroundColor: medals[potential.rating],borderColor:colors.dark,borderWidth:StyleSheet.hairlineWidth }}>
                <Text style={{color:colors.dark,textAlign:'center',fontSize:18}}></Text>
                </View>}

            </View>
          </TouchableHighlight>


                <View style={{top:-50,flexDirection:'column',alignItems:'center',left:0,justifyContent:'center',backgroundColor:colors.outerSpace,width:DeviceWidth,}}>

                {potential.bio && potential.user.bio &&
                  <View style={{margin:MagicNumbers.screenPadding/2,width:DeviceWidth,}}>
                    <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                        rel =='single' ? `About Me` : `About Us`
                    }</Text>
                    <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                        potential.bio || potential.user.bio
                    }</Text>
                  </View>
                }

                  <View style={{ paddingVertical:20,width:DeviceWidth,alignItems:'stretch' }}>
                    <UserDetails potential={potential} user={this.props.user} location={'card'} />
                  </View>

                  <TouchableOpacity onPress={this.reportModal.bind(this)}>
                    <View style={{marginTop:20,paddingBottom:50}}>
                      <Text style={{color:colors.mandy,textAlign:'center'}}>Report or Block this user</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity  style={{flexDirection:'column',alignItems:'center',
  justifyContent:'center',}} onPress={this.closeProfile.bind(this)}>
                    <Image
                      resizeMode={Image.resizeMode.contain}
                      style={{height:12,width:12,marginTop:10}}
                      source={{uri: 'assets/close@3x.png'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

            </Animated.View>



          </ScrollView>


       
        </View>

      )
    }
  }
}

// reactMixin.onClass(Card,scrollable)
export default Card
