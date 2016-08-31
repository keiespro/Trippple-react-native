import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  Image,
  TouchableOpacity,
  Animated,
  PixelRatio,
  Dimensions,
} from 'react-native';
import React from "react";

import ParallaxSwiper from './controls/ParallaxSwiper';
import ReportModal from './modals/ReportModal';
import Swiper from './controls/swiper';
import UserDetails from './UserDetails';
import XButton from './buttons/XButton';
import colors from '../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../utils/DeviceConfig'
import {BlurView} from 'react-native-blur'
import {
  NavigationStyles,
} from '@exponent/ex-navigation';



const CardLabel = (props) => (
  <View>
    <Text
      style={[styles.cardBottomText, {color:props.textColor}]}
      key={`${props.potential.user.id}-names`}
    >{ props.matchName }
    </Text>
    <Text
      style={[styles.cardBottomOtherText, {color:props.textColor}]}
      key={`${props.potential.user.id}-matchn`}
    >{
        props.city + props.seperator + (props.distance ? ` ${props.distance} ${props.distance == 1 ? 'mile' : 'miles'} away` : ``)
    }</Text>
  </View>
);


class UserProfile extends React.Component{

  static route = {
    styles: NavigationStyles.FloatVertical,
    navigationBar: {
      visible:false
    }
  };

  static defaultProps = {
    cardWidth: DeviceWidth
  };

  constructor(props){
    super()

    this.state = { slideIndex: 0 }
  }
  reportModal(){

     this.props.navigator.push({
      component: ReportModal,
      passProps: {
        action: 'report',
        them: [potential.user, potential.partner],
        goBack: ()=> {
          this.props.navigator.pop()
        }
      }
    })
  }
  render(){

  var {  potential, user } = this.props,
      matchName = potential.user.firstname.trim();
      distance = potential.user.distance || 0,
      city = potential.user.city_state || '';
  const rel = this.props.rel || this.props.user.relationship_status;
const profileVisible = true;

const isTopCard = true;
const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];

if (potential.partner && potential.partner.firstname) {
  names.push(potential.partner.firstname.trim());
}
const seperator = distance && city.length ? ' | ' : '';

  const heights = {
    smallest: {
      top: -60,
      second: -60,
      third: -55,
    },
    middle: {
      top: -65,
      second: -55,
      third: -50,
    },
    all: {
      top: -50,
      second: -50,
      third: -60,
    },
  };

  const heightTable = MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
  const cardHeight = DeviceHeight + (isTopCard ? heightTable.top : heightTable.second);
  const cardWidth =  DeviceWidth;

  if(potential.partner) {
    matchName += ' & ' + potential.partner.firstname.trim()
  }

      const hasPartner = potential.partner && potential.partner.image_url && potential.partner.image_url !== "";
      const slideFrames = hasPartner ? [potential.user,potential.partner] : [potential.user]
      const tmpCardHeight = profileVisible ? cardHeight : cardHeight;
      const slides = slideFrames.map((p,i) => {
        return (
          <View
            key={`${p.id}slide${i}`}
            style={{backgroundColor:'transparent',flex:1,position:'relative',height:tmpCardHeight,width:cardWidth}}
          >
            <Image
              onLayout={(e)=>console.log(e.nativeEvent.layout,'LAYOUT')}
              source={{uri: p.image_url }}
              resizeMode="cover"
              style={{flex:1,height:tmpCardHeight,width:cardWidth}}
            />
        </View>
        )
      });

  return (

      <View>

                <ParallaxSwiper
                  contentContainerStyle={[{height: profileVisible ? DeviceHeight : cardHeight,alignItems:'stretch',justifyContent:'center',flexDirection:'column',flex:1,width:cardWidth}]}
                  scrollEnabled={profileVisible ? true : false}
                  showsVerticalScrollIndicator={false}
                  style={[{flex:1,height:(DeviceHeight*2)}]}
                  header={<View/>}
                  dispatch={this.props.dispatch}
                  windowHeight={10}
                  swiper={(
                    <Swiper
                      width={cardWidth}
                      height={DeviceHeight}
                      dispatch={this.props.dispatch}
                      style={{flex:0,zIndex:0,backgroundColor:'transparent'}}>
                     {slides}
                   </Swiper>
                  )}
                >
                  <BlurView key={'blurkey'+potential.user.id} blurType="dark" style={{
                    backgroundColor:colors.outerSpace20,
                    position:'relative',
                    zIndex:100,
                    height: profileVisible ? (DeviceHeight*1.5) : 0,
                    opacity: profileVisible ? 1 : 0,
                    overflow:'hidden',
                    flex:0,
                    bottom:0,
                    alignSelf:'flex-end',
                    width: DeviceWidth,
                    top:-260,
                  }}
                  >

                    <View style={{ paddingVertical: 20, width: DeviceWidth,flex: 1,}}>
                      <View style={{marginHorizontal:MagicNumbers.screenPadding/2,marginBottom:20}}>
                        <CardLabel
                          potential={potential}
                          seperator={seperator}
                          matchName={matchName}
                          city={city}
                          distance={distance}
                          textColor={colors.white}
                        />
                      </View>
                      {potential.bio || potential.user.bio &&
                        <View style={{ margin: MagicNumbers.screenPadding / 2, width: DeviceWidth }}>
                          <Text style={[styles.cardBottomOtherText, { color: colors.white, marginBottom: 15, marginLeft: 0 }]}>{
                              !hasPartner ? `About Me` : `About Us`
                          }</Text>
                          <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                              potential.user.bio
                          }</Text>
                        </View>
                      }

                      {potential.partner && potential.partner.bio &&
                        <View style={{ margin: MagicNumbers.screenPadding / 2, width: DeviceWidth }}>
                          <Text style={{ color: colors.white, fontSize: 18, marginBottom: 15 }}>{
                              potential.partner.bio
                          }</Text>
                        </View>
                      }

                      <UserDetails
                        potential={potential}
                        user={this.props.user}
                        location={'card'}
                      />

                    {potential.user.id != user.id && potential.user.id != user.partner_id && <TouchableOpacity onPress={this.props.reportModal}>
                        <View style={{ marginTop: 20, paddingBottom: 50 }}>
                          <Text style={{ color: colors.mandy, textAlign: 'center' }}>Report or Block this user</Text>
                        </View>
                      </TouchableOpacity>}

                      <TouchableOpacity
                        style={{ height: 50, alignItems: 'center', width: 50, justifyContent: 'center',flex:0,alignSelf:'center' }}
                        onPress={this.props.closeProfile}
                      >
                        <Image
                          resizeMode={Image.resizeMode.contain}
                          style={{ height: 12, width: 12, marginTop: 10 }}
                          source={{ uri: 'assets/close@3x.png' }}
                        />
                      </TouchableOpacity>
                    </View>

                  </BlurView>
                  <XButton navigator={this.props.navigator}/>
        </ParallaxSwiper>
      </View>

    )
  }
}
export default UserProfile

var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.object,
    tabs: React.PropTypes.array,
    pageNumber:React.PropTypes.number

  },

  renderTabOption(name, page) {
    var isTabActive = this.props.pageNumber === page;
    return (
      <TouchableOpacity key={name+page+' '+isTabActive} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{
              fontFamily:'Montserrat',fontSize:16,
              color: isTabActive ? colors.white : colors.shuttleGray}}>{name.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  },



  render() {
    var numberOfTabs = this.props.tabs.length;
    var w = MagicNumbers.screenWidth / numberOfTabs;

    var tabUnderlineStyle = {
      position: 'absolute',
      width: MagicNumbers.screenWidth / 2,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform:[
        {translateX: this.props.activeTab ? this.props.activeTab.interpolate({
                inputRange: this.props.tabs.map((c,i) => (w * i) ),
                outputRange: [0,w]
              }) : 0
            }]
    };

    return (
      <View style={[styles.tabs,{marginHorizontal:MagicNumbers.screenPadding/2}]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={'TAB_UNDERLINE_REF'} />
      </View>
    );
  },
});


const styles = StyleSheet.create({

shadowCard:{
  shadowColor:colors.darkShadow,
  shadowRadius:5,
  shadowOpacity:50,
  shadowOffset: {
    width:0,
    height: 5
  }
},
tab: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  width:DeviceWidth,

},
singleTab:{
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: MagicNumbers.screenPadding/2,
  width:MagicNumbers.screenWidth,

},
tabs: {
  height: 60,
  flexDirection: 'row',
  marginTop: 0,
  borderWidth: 1,
  width:DeviceWidth,
  flex:1,
  marginHorizontal:0,
  borderTopWidth: 1,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth:1,
  overflow:'hidden',
  justifyContent:'center',
  alignItems:'center',
  borderColor: colors.shuttleGray,
},
animatedIcon:{
  height:60,
  width:60,
  borderRadius:30,
  alignItems:'center',
  justifyContent:'center',
  top:DeviceHeight/2 - 80,
  left:DeviceWidth/2 - 50,
  position:'absolute',
  // shadowColor:colors.darkShadow,
  backgroundColor:'transparent',
  // shadowRadius:5,
  // shadowOpacity:50,
  overflow:'hidden',
  // shadowOffset: {
  //   width:0,
  //   height: 5
  // }
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow:'hidden',
    top:50
  },
  absoluteText:{
    position:'absolute',
    color:'#ffffff',
    backgroundColor:'transparent',
    fontSize:20
  },
  absoluteTextTop:{
    top:0
  },
  absoluteTextBottom:{
    bottom:0
  },
  basicCard:{
    borderRadius:8,
    backgroundColor: 'transparent',
      borderWidth: 1 / PixelRatio.get(),
      borderColor:'rgba(0,0,0,.2)',
      overflow:'hidden',

    },
    bottomButtons: {
      height: 80,
      alignItems: 'center',
      flexDirection: 'row',
      top:-40,
      justifyContent:'space-around',
      alignSelf:'stretch',
      width: undefined
    },
    topButton: {
      height: 80,
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderColor: colors.white,
      borderWidth: 0,
      borderRadius: 0,
      marginBottom: 0,
      marginTop: 0,
      alignSelf: 'stretch',
      alignItems:'center',
      justifyContent: 'center'
    },
  card: {
    borderRadius:8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0,
    borderColor:'rgba(0,0,0,.2)',
    overflow:'hidden'

  },

  closeProfile:{
    position:'absolute',
    top:10,
    left:5,
    width: 50,

    backgroundColor:'transparent',

    height: 50,
    alignSelf:'center',

    overflow:'hidden',

    justifyContent:'center',
    alignItems:'center',
    padding:20,
    borderRadius:25
  },
  dashedBorderImage:{
    marginHorizontal:0,
    marginTop:65,
    marginBottom:20,
    padding:0,
    width:DeviceWidth,
    height:DeviceHeight-100,
    flex:1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
     padding:0,
    alignItems:'stretch',
    flexDirection:'column',
    width:DeviceWidth,
    height:DeviceHeight,

  },

  dot: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,

    borderColor: colors.white
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  wrapper:{

  },
  scrollSection:{
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    padding:0,
    margin:0,
    alignItems: 'center',
    flexDirection: 'column'
  },
  circleimage:{
    backgroundColor: colors.shuttleGray,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor:colors.white,
    borderWidth: 3
  },
  cardStackContainer:{
    width:DeviceWidth,
    height:DeviceHeight,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    backgroundColor:'transparent'
  },

  cardBottomText:{
    marginLeft:0,
    fontFamily:'Montserrat-Bold',
    color: colors.shuttleGray,
    fontSize:18,
    marginTop:0
  },
  cardBottomOtherText:{
    marginLeft:20,
    fontFamily:'omnes',
    color: colors.rollingStone,
    fontSize:16,
    marginTop:0,
    opacity:0.5
  }
});

var animations = {
  layout: {
    spring: {
      duration: 250,
      create: {
        duration: 250,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
      },
      update: {
        duration: 250,
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {

        duration: 2000,
        // property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,

      }
    }
  }
}
