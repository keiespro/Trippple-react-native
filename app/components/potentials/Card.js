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
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native'

import SliderTabBar from './SliderTabBar'
import animations from './LayoutAnimations'
import styles from './styles'
import FakeNavBar from '../../controls/FakeNavBar';
import ScrollableTabView from '../../scrollable-tab-view'
import Mixpanel from '../../utils/mixpanel';
import colors from '../../utils/colors';
import Swiper from '../../controls/swiper';
import ProfileTable from '../ProfileTable'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../DeviceConfig'
import scrollable from 'react-native-scrollable-decorator'

const cardSizeMap = {

}

@scrollable
class Card extends React.Component{

  static defaultProps = {
    profileVisible: false
  }

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
    this.setState({activeIndex: this.state.activeIndex + 1})
    this.props.toggleProfile()
  }
  componentWillReceiveProps(nProps){
    if(nProps.pan && this.props.profileVisible != nProps.profileVisible){
      LayoutAnimation.configureNext(animations.layout.spring);
      this.toggleCardHoverOff()

    }
  }

  toggleCardHoverOn(){

    this.refs.cardinside.setNativeProps({
      style: { shadowColor: colors.darkShadow, shadowRadius:30, shadowOpacity: 1 }
    })

  }
  toggleCardHoverOff(){
    this.refs.cardinside.setNativeProps({
      style: {   shadowColor: colors.darkShadow, shadowRadius:0, shadowOpacity: 0  }
    })
  }


  render(){

    var { rel, potential, profileVisible, isTopCard, isThirdCard, pan } = this.props,
        matchName = `${potential.user.firstname.trim()} ${potential.user.age}`,
        distance = potential.user.distance,
        city = potential.user.city_state;

    if(rel == 'single') {
      matchName += ` & ${potential.partner.firstname.trim()} ${potential.partner.age}`
      distance = Math.min(distance,potential.partner.distance)
    }


    if(!profileVisible){
    return (
      <View
        shouldRasterizeIOS={!this.props.animatedIn}
        ref={'cardinside'} key={`${potential.id || potential.user.id}-inside`}
        style={ [{
          borderRadius: 8,
          flex:1,
          width:DeviceWidth,
          position:'relative',
          height:DeviceHeight-55,
          left:0,
          right:0,

        } ]}>

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
              width:DeviceWidth,
              left:0,
              right:0,
              flex:1,

    }}
    contentOffset={{x:0,y:0}}
            style={[styles.card,{
              margin:0,
              padding:0,
                width:DeviceWidth-40,
                left:0,right:0,
                padding: 0,
                paddingTop: 0,
                height:DeviceHeight-80,
                  position:'relative',
              flex:1,
              backgroundColor: colors.white,
           }]} key={`${potential.id || potential.user.id}-view`}>

              <Animated.View
                key={`${potential.id || potential.user.id}bgopacity`}
                ref={isTopCard ? 'incard' : null}
                style={{
                  flex:1,
                  alignItems:'center',
                  justifyContent:'center',left:0,right:0,
                  marginHorizontal:0,
                  flexDirection:'column',
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
                }}
                >
                {potential.user.relationship_status == 'couple' ? <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  style={{
                    alignSelf:'center',
                    marginLeft:0,
                    overflow:'hidden',
                    marginRight:0,
                    left:0,
                  }}
                  showsPagination={true}
                  paginationStyle={{position:'absolute',paddingRight:40,right:0,top:45,height:100}}
                  >
                  <TouchableWithoutFeedback
                    key={`${potential.user.id}-touchableimg`}
                    style={[styles.imagebg,{ overflow:'hidden'}]}
                    onPressIn={this.toggleCardHoverOn.bind(this)}
                    onPressOut={this.toggleCardHoverOff.bind(this)}
                    onPress={this.openProfileFromImage.bind(this)}
                  >
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    defaultSource={{uri:'../../newimg/defaultuser.png'}}
                    style={[styles.imagebg, {
                      backgroundColor: colors.white,
                      width: DeviceWidth,
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
                  </TouchableWithoutFeedback>

                  {rel == 'single' && potential.partner &&

                  <TouchableWithoutFeedback
                    key={`${potential.partner.id}-touchableimg`}
                    style={[styles.imagebg,{}]}
                    onPressIn={this.toggleCardHoverOn.bind(this)}
                    onPressOut={this.toggleCardHoverOff.bind(this)}
                    onPress={this.openProfileFromImage.bind(this)}
                    >
                    <Animated.Image
                      source={{uri: potential.partner.image_url}}
                      key={`${potential.partner.id}-cimg`}
                      defaultSource={{uri:'../../newimg/defaultuser.png'}}
                      style={[styles.imagebg,{
                        backgroundColor: colors.white,
                        flex:1,
                        width: DeviceWidth,
                        opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                            inputRange:  [-300, -80, 0, 80, 300],
                            outputRange: [   0,   1, 1,  1,   0]
                        }) : 1
                      }]}
                      resizeMode={Image.resizeMode.cover}
                    />
                  </TouchableWithoutFeedback>
                }
                </Swiper> :
                <TouchableWithoutFeedback
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{ overflow:'hidden'}]}
                  onPressIn={this.toggleCardHoverOn.bind(this)}
                  onPressOut={this.toggleCardHoverOff.bind(this)}
                  onPress={this.openProfileFromImage.bind(this)}
                  >
                  <Animated.Image
                    source={{uri: potential.partner.image_url}}
                    key={`${potential.partner.id}-cimg`}
                    defaultSource={{uri:'../../newimg/defaultuser.png'}}
                    style={[styles.imagebg,{
                      backgroundColor: colors.white,
                      flex:1,
                      width: DeviceWidth,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange:  [-300, -80, 0, 80, 300],
                          outputRange: [   0,   1, 1,  1,   0]
                      }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                  />
                </TouchableWithoutFeedback>
                }


            <View
              key={`${potential.id || potential.user.id}-bottomview`}
              style={{
                height: isTopCard ? 120 : 105,
                marginTop: isTopCard ? -110 : -105,
                flexDirection:'row',
                flex:1,
                left:0,
                bottom:isTopCard ? -40 : -110,
                backgroundColor:colors.white,
                width:DeviceWidth,
                position:'absolute',
                marginRight: this.props.profileVisible ? 0 : 50,
              }}
              >
            {isTopCard ?
              <View
              key={`${potential.id || potential.user.id}-infos`}
              style={{
                padding: isTopCard ? 10 : 5,
                paddingTop:15, paddingBottom:15, height:110,flex:1,
              top:0,}}>
                  <Text style={[styles.cardBottomText,{}]}
                    key={`${potential.id || potential.user.id}-names`}>{
                      {matchName}
                    }</Text>
                    <Text style={[styles.cardBottomOtherText,{flex:1}]}
                    key={`${potential.id || potential.user.id}-matchn`}>{
                      `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                    }</Text>
                </View> : null }

            {this.props.rel == 'single' && isTopCard ?

              <View style={{
                height:74,
                top:-35,
                right:35,
                alignSelf:'flex-end',
                position:'absolute',
                padding:5,
                alignItems:'flex-end',
                backgroundColor:'transparent',
                flexDirection:'row'}}>
                <TouchableHighlight onPress={(e)=>{ this.setState({activeIndex: 0}) }}
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
                <TouchableHighlight onPress={(e)=>{ this.setState({activeIndex: 1}) }}
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

              </View>
            </Animated.View>

          {isTopCard && !profileVisible ?
            <Animated.View key={'denyicon'} style={[styles.animatedIcon,{
              transform: [
                {
                  scale: this.props.pan ? this.props.pan.x.interpolate({
                    inputRange: [-DeviceWidth/2,-50,0], outputRange: [2,0,0]}) : 0
                }
            ],
            // marginLeft: this.props.pan ? this.props.pan.x.interpolate({
            //   inputRange: [-DeviceWidth/3,0],
            //   outputRange: [50,0]}) : 0

            }]}>
              <Image
              source={require('../../../newimg/iconDeny.png')}
              style={{
                backgroundColor:'transparent',
                width:60,
                height:60,
                paddingLeft:50
              }}/>
            </Animated.View> : null }

          {isTopCard && !profileVisible  ?
              <Animated.View key={'approveicon'} style={[styles.animatedIcon,{
                transform: [
                  {
                    scale: this.props.pan ? this.props.pan.x.interpolate({
                      inputRange: [0,50, DeviceWidth/2], outputRange: [0,0,2]
                    }) : 0
                  }
              ],
              // marginLeft: this.props.pan ? this.props.pan.x.interpolate({
              //   inputRange: [0, DeviceWidth/3],
              // outputRange: [0,-50]
              // }) : 0


              }]}>
              <Image
              source={require('../../../newimg/iconApprove.png')}
              style={{backgroundColor:'transparent',width:60,height:60,
                paddingRight:50,
              }}/>
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
// ProfileVisible
      return (
        <View
          ref={'cardinside'}
          key={`${potential.id || potential.user.id}-inside`}
          style={[ {
              width:DeviceWidth,
              position: 'absolute',
              right:0,
              left:-20,
              alignItems:'flex-start',
              height:DeviceHeight,
              right:0,
              alignSelf:'stretch',
              flex:1
          } ]}>

          <ScrollView
            style={[{
              margin:0,
              width:DeviceWidth,
              paddingTop:55,
              top:0,
              left:0,
              right:0,
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
              style={{
              }}
              ref={"incard"}
              >

              {potential.user.relationship_status == 'couple' ?
                <Swiper
                  key={`${potential.id || potential.user.id}-swiper`}
                  loop={true}
                  horizontal={false}
                  activeIndex={this.state.activeIndex}
                  vertical={true}
                  autoplay={false}
                  showsPagination={true}
                  showsButtons={false}
                  width={DeviceWidth}
                  height={DeviceHeight}
                  style={{width:DeviceWidth,overflow: 'hidden',}}

                  paginationStyle={{position:'absolute',right:0,top:45,height:100}}
                  >

               <TouchableWithoutFeedback
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{
                    width: DeviceWidth,

                  }]}

                  onPress={this.openProfileFromImage.bind(this)}
                  onPressIn={(e)=>{
                    // this.refs.cardinside.setNativeProps({
                      // style: { opacity: 0.8 }
                    // })
                  }}
                  >
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      flex:1,
                      width: DeviceWidth,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -80, 0, 80, 300],
                          outputRange: [0,1,1,1,0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                   />
                </TouchableWithoutFeedback>

                {rel == 'single' && potential.partner &&
                <TouchableWithoutFeedback
                  key={`${potential.partner.id}-touchableimg`}
                  style={[styles.imagebg,{ }]}
                  onPress={this.openProfileFromImage.bind(this)}>


                  <Animated.Image
                    source={{uri: potential.partner.image_url}}
                    key={`${potential.partner.id}-cimg`}
                    style={[styles.imagebg,{
                      width: DeviceWidth,
                      flex:1,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -100, 0, 100, 300],
                          outputRange: [0,1,1,1,0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}

                  />
                </TouchableWithoutFeedback>
              }
              </Swiper> :
               <TouchableWithoutFeedback
                  key={`${potential.user.id}-touchableimg`}
                  style={[styles.imagebg,{ overflow:'hidden'}]}
                  onPressIn={this.toggleCardHoverOff.bind(this)}
                  onPressOut={this.toggleCardHoverOn.bind(this)}
                  onPress={this.openProfileFromImage.bind(this)}
                  >
                  <Animated.Image
                    source={{uri: potential.user.image_url}}
                    key={`${potential.user.id}-cimg`}
                    style={[styles.imagebg, {
                      flex:1,
                      alignSelf:'stretch',
                      height:500,

                      width: DeviceWidth,
                      opacity:  this.props.isTopCard && this.props.pan ? this.props.pan.x.interpolate({
                          inputRange: [-300, -80, 0, 80, 300],
                          outputRange: [0,1,1,1,0]
                        }) : 1
                    }]}
                    resizeMode={Image.resizeMode.cover}
                   />
                </TouchableWithoutFeedback>
            }

            <View
            key={`${potential.id || potential.user.id}-bottomview`}

            style={{
              // height: 800,
              top: 0,
              marginTop: (DeviceHeight <= 568 ? -80 : -180),
              backgroundColor:colors.outerSpace,
              flex:1,
              left:0,
              right:0,
              // bottom:-180,
              width:DeviceWidth,
              }} >

              <View
              key={`${potential.id || potential.user.id}-infos`}
              style={{
                // height:60,
                // overflow:'hidden',
                width: DeviceWidth,
                left:0,
                height:150,
                marginLeft: MagicNumbers.screenPadding/2,
                paddingVertical:20, }}>
              <Text
              key={`${potential.id || potential.user.id}-names`}
              style={[styles.cardBottomText,{color:colors.white,width:DeviceWidth-40}]}>
              {
                {matchName}
              }
              </Text>
              <Text
                key={`${potential.id || potential.user.id}-matchn`}
                style={[styles.cardBottomOtherText,{color:colors.white,width:DeviceWidth-40}]}>
                {
                  `${city} | ${distance} ${distance == 1 ? 'mile' : 'miles'} away`
                }
              </Text>
            </View>

          {this.props.rel == 'single' &&
            <View style={{
              height:60,
              top:-30,
              position:'absolute',
              width:125,
              right:0,
              backgroundColor:'transparent',
              flexDirection:'row'}}
              >
              <TouchableHighlight onPress={(e)=>{ this.setState({activeIndex: 0}) }}
              underlayColor={colors.mediumPurple}
              style={[styles.circleimagewrap,{
                backgroundColor:colors.outerSpace
              }]}>
                <Image
                  source={{uri: this.props.potential.user.image_url}}
                  key={this.props.potential.user.id + 'img'}
                    style={[(DeviceHeight > 568 ? styles.circleimage : styles.circleimageSmaller), {
                      marginRight:0,
                      opacity: this.state.activeIndex == 1 ? 1 : 0.9

                    }]}
                />
              </TouchableHighlight>
              <TouchableHighlight onPress={(e)=>{ this.setState({activeIndex: 1}) }}
              underlayColor={colors.mediumPurple}
              style={[styles.circleimagewrap,{
                backgroundColor:colors.outerSpace
              }]}>
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

          <View style={{top:-50,padding:MagicNumbers.screenPadding/4}}>

            {potential.bio || potential.user.bio ?
              <View style={{}}>
                <Text style={[styles.cardBottomOtherText,{color:colors.white,marginBottom:15,marginLeft:0}]}>{
                    rel =='single' ? `About Me` : `About Us`
                }</Text>
                <Text style={{color:colors.white,fontSize:18,marginBottom:15}}>{
                    potential.bio || potential.user.bio
                }</Text>
              </View> : null}

              {this.props.rel == 'single' && potential.partner ?

                 <ScrollableTabView tabs={['1','2']} renderTabBar={(props) => <SliderTabBar {...props}  /> }>
                  <ProfileTable profile={this.props.potential.user}
                    tabLabel={`${potential.user.firstname}, ${potential.user.age}`}/>
                  <ProfileTable profile={potential.partner}
                    tabLabel={`${potential.partner.firstname}, ${potential.partner.age}`}/>
                  </ScrollableTabView> :

                  <View style={{flex:1,width:DeviceWidth,
                    flex:1,
                    alignSelf:'stretch',
                    marginHorizontal:0}}>
                    <View style={styles.tabs}>
                      <Text style={{width:DeviceWidth-40,
                          fontFamily:'Montserrat',fontSize:16,textAlign:'center',
                          color:  colors.white }}>
                          {`${potential.user.firstname} ${potential.user.age}`
                      }</Text>
                    </View>
                    <View style={[styles.singleTab]}>
                      <ProfileTable profile={potential.user} tabLabel={'single'}/>
                    </View>
                  </View>

              }

              <View style={{flex:1,marginTop:20,paddingBottom:50}}>
                <Text style={{color:colors.mandy,textAlign:'center'}}>Report or Block this user</Text>
              </View>

            </View>

          </View>

          </Animated.View>
          </ScrollView>
          <View
          key={'navbarholder'+potential.user.id}
            style={{
              backgroundColor:'black',
              width:DeviceWidth,
              position:'absolute',
                height:55,
                top:0,
                overflow:'visible',
                borderRadius:0
            }}
            >
            <View style={{backgroundColor:'#000'}}>
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
                height:55,
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
                source={require('../../../newimg/close.png')}
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
export default Card
